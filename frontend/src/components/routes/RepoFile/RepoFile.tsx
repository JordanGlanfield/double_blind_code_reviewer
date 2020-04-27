import React, { useEffect, useState } from "react";

import { Button, Comment as AntdComment, Input, InputNumber, Typography } from "antd";
import Prism from "prismjs";
import "./prism-vs.css"
import { extractPathFromRoute, getFileExtension, getFileName, getNextDirUp } from "../../../utils/routeUtil";

import { Link, RouteComponentProps, useParams } from "react-router-dom";
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
import "prismjs/components/prism-python";
import { getComments, postComment } from "../../../utils/commentApi";
import Comment from "../../../types/Comment";
import { useDataSource } from "../../../utils/hooks";
import { getUsername } from "../../../utils/authenticationService";
import ContentArea from "../../styles/ContentArea";

interface Props extends RouteComponentProps {
}

const RepoFile = (props: Props) => {
  const {repo} = useParams();
  const filePath = extractPathFromRoute(props);

  useEffect(() => {
    Prism.highlightAll();
  });

  let repoId = repo ? repo : "";
  let fileSource = useDataSource(() => getFile(repoId, filePath));
  let commentsSource = useDataSource(() => getComments(repoId, filePath));

  if (!repo) {
    return <div>Invalid parameters</div>;
  }

  if (fileSource.isFetching) {
    return <Typography>Loading file...</Typography>
  }

  if (fileSource.hasError) {
    return <Typography>Failed to load file.</Typography>
  }

  let commentInformation;

  if (commentsSource.isFetching) {
    commentInformation = <Typography>Loading comments...</Typography>
  } else if (commentsSource.hasError) {
    commentInformation = <Typography>Failed to load comments.</Typography>
  }

  const onClickComment = (comment: string, lineNumber: undefined | number) => {
    postComment(repo, filePath, lineNumber, undefined, comment)
      .then(commentsSource.forceRefetch);
  };

  const dirHref = routes.getRepoDir(getUsername(), repo, getNextDirUp(filePath));

  return <ContentArea>
    <Link to={dirHref}><Button>Back To Folder</Button></Link>
    <Typography>{filePath}</Typography>
    {commentInformation}
    {getFileComponents(filePath, fileSource.data, commentsSource.data)}
    <AddComment onClick={onClickComment} maxLines={fileSource.data?.split("\n").length}/>
  </ContentArea>
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
  onClick: (text: string, lineNumber: number | undefined) => void;
  maxLines: number;
}

const AddComment = (props: AddCommentProps) => {
  const [comment, setComment] = useState("");
  const [lineNumber, setLineNumber] = useState(0 as undefined | number);

  return <>
    <Input value={comment} onChange={(e) => setComment(e.target.value)}/>
    <InputNumber value={lineNumber}
                 min={0}
                 max={props.maxLines}
                 onChange={(number) => setLineNumber(number)}/>
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