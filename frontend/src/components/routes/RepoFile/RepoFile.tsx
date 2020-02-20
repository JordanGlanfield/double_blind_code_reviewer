import React, { useEffect, useRef, useState } from "react";

import {Button, Typography, Input} from "antd";
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

interface Props extends RouteComponentProps {
}

// TODO - add mapping from file extension to language
const RepoFile = (props: Props) => {
  const [fileContents, setFileContents] = useState(undefined as string | undefined);
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

  getComments(repo, filePath).then(commentsMap => {
    console.log(commentsMap[0]);
    console.log(commentsMap);
  });

  let number = 0;

  const onClickComment = (comment: string) => {
    postComment(repo, filePath, ++number, undefined, comment);
  };

  const dirHref = routes.getRepoDir(user, repo, getNextDirUp(filePath));
  const language = getFileExtension(getFileName(filePath));

  return <>
    <Button href={dirHref}>Back To Folder</Button>
    <Typography>{filePath}</Typography>
    <pre className="line-numbers">
      <code className={"language-" + language}>
        {fileContents}
      </code>
    </pre>
    <Comment onClick={onClickComment}/>
  </>
};

interface CommentProps {
  onClick: (text: string) => void
}

const Comment = (props: CommentProps) => {
  let textInput: Input;

  return <>
    <Button onClick={() => props.onClick(textInput.input.value)}>Comment</Button>
    <Input ref={(ref) => textInput = ref as Input} />
  </>
};

export default RepoFile;