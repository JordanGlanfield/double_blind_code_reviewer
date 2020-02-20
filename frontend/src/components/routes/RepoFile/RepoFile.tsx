import React, { useEffect, useRef, useState } from "react";

import {Comment as AntdComment, Button, Typography, Input} from "antd";
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
import Comment, { LineNumbersToComments } from "../../../types/Comment";

interface Props extends RouteComponentProps {
}

const RepoFile = (props: Props) => {
  const [fileContents, setFileContents] = useState(undefined as string | undefined);
  const [commentsByLine, setCommentsByLine] = useState(undefined as undefined | LineNumbersToComments);
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

  let number = 0;

  // TODO - smarter component update
  const onClickComment = (comment: string) => {
    postComment(repo, filePath, ++number, undefined, comment)
      .then(() => getComments(repo, filePath).then(setCommentsByLine));
  };

  const dirHref = routes.getRepoDir(user, repo, getNextDirUp(filePath));

  return <>
    <Button href={dirHref}>Back To Folder</Button>
    <Typography>{filePath}</Typography>
    <CodeSection filePath={filePath} lines={fileContents}/>
    <AddComment onClick={onClickComment}/>
  </>
};

interface AddCommentProps {
  onClick: (text: string) => void
}

const AddComment = (props: AddCommentProps) => {
  let textInput: Input;

  return <>
    <Button onClick={() => props.onClick(textInput.input.value)}>Comment</Button>
    <Input ref={(ref) => textInput = ref as Input} />
  </>
};

interface CommentProps {
  comment: Comment
}

const FileComment = (props: CommentProps) => {
  return <AntdComment content={props.comment} author={props.comment.author_pseudonym}/>
};

interface CodeSectionProps {
  filePath: string;
  lines: string;
}

const CodeSection = (props: CodeSectionProps) => {
  const language = getFileExtension(getFileName(props.filePath));

  return <pre className="line-numbers">
      <code className={"language-" + language}>
        {props.lines}
      </code>
    </pre>
}

export default RepoFile;