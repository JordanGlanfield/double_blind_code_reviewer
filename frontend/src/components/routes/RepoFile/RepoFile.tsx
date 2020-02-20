import React, { useEffect, useRef, useState } from "react";

import { Comment as AntdComment, Button, Typography, Input, InputNumber } from "antd";
import Prism from "prismjs";
import "./prism-vs.css"
import { extractPathFromRoute, getFileExtension, getFileName, getNextDirUp } from "../../../utils/routeUtil";

import { RouteComponentProps, useParams } from "react-router-dom";
import { getFile } from "../../../utils/repoApi";
import routes from "../../../constants/routes";

import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import "prismjs/components/prism-yaml";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import { getComments, postComment } from "../../../utils/commentApi";
import Comment from "../../../types/Comment";

interface Props extends RouteComponentProps {
}

const RepoFile = (props: Props) => {
  const [fileContents, setFileContents] = useState(undefined as string | undefined);
  const [commentsByLine, setCommentsByLine] = useState(undefined as undefined | Map<number, Comment[]>);
  const {user, repo} = useParams();
  const filePath = extractPathFromRoute(props);

  useEffect(() => {
    Prism.highlightAll();
  });

  if (!user || !repo) {
    return <div>Invalid parameters</div>;
  }

  if (fileContents === undefined) {
    getFile(repo, filePath).then(file => {
      setFileContents(file);
    });

    return <div>Loading...</div>
  }

  if (!commentsByLine) {
    getComments(repo, filePath).then(setCommentsByLine);
  }

  // TODO - smarter component update
  const onClickComment = (comment: string, lineNumber: undefined | number) => {
    postComment(repo, filePath, lineNumber, undefined, comment)
      .then(() => getComments(repo, filePath).then(setCommentsByLine));
  };

  const dirHref = routes.getRepoDir(user, repo, getNextDirUp(filePath));

  return <>
    <Button href={dirHref}>Back To Folder</Button>
    <Typography>{filePath}</Typography>
    {getFileComponents(filePath, fileContents, commentsByLine)}
    <AddComment onClick={onClickComment}/>
  </>
};

function getFileComponents(filePath: string, fileContents: string, commentsMap: Map<number, Comment[]> | undefined) {
  if (!commentsMap || commentsMap.size === 0) {
    return [<CodeSection key={0} filePath={filePath} lines={fileContents} lineNumber={0} />]
  }

  let lines = fileContents.split("\n");
  let components: JSX.Element[] = [];
  let lastLine = 0;
  let key = 0;

  function createCodeSection(from: number, to: number): JSX.Element {
    return <CodeSection key={key++}
                 filePath={filePath}
                 lineNumber={from}
                 lines={lines.slice(from, to).join("\n")} />
  }

  commentsMap.forEach((comments, lineNumber) => {
    components.push(createCodeSection(lastLine, lineNumber + 1));

    comments.forEach(comment => {
      components.push(<FileComment key={key++} comment={comment}/>)
    });

    lastLine = lineNumber + 1;
  });

  if (lastLine < lines.length) {
    components.push(createCodeSection(lastLine, lines.length));
  }

  return components;
}

interface AddCommentProps {
  onClick: (text: string, lineNumber: number | undefined) => void
}

const AddComment = (props: AddCommentProps) => {
  const [comment, setComment] = useState("");
  const [lineNumber, setLineNumber] = useState(0 as undefined | number);

  return <>
    <Input value={comment} onChange={(e) => setComment(e.target.value)}/>
    <InputNumber value={lineNumber} onChange={(number) => setLineNumber(number)}/>
    <Button onClick={() => props.onClick(comment, lineNumber)}>Comment</Button>
  </>
};

interface CommentProps {
  comment: Comment
}

const FileComment = (props: CommentProps) => {
  return <AntdComment content={<p>{props.comment.contents}</p>} author={props.comment.author_pseudonym}/>
};

interface CodeSectionProps {
  filePath: string;
  lineNumber: number;
  lines: string;
}

const CodeSection = (props: CodeSectionProps) => {
  const language = getFileExtension(getFileName(props.filePath));

  return <pre className="line-numbers" data-start={props.lineNumber}>
      <code className={"language-" + language}>
        {props.lines}
      </code>
    </pre>
};

export default RepoFile;