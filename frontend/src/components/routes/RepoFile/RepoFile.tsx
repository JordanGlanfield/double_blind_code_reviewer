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
import "./code.css"

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
import styled from "styled-components";

interface Props extends RouteComponentProps {
}

const RepoFile = (props: Props) => {
  const {repoId, repoName} = useParams();
  const filePath = extractPathFromRoute(props);

  useEffect(() => {
    Prism.highlightAll();
  });

  const [newCommentLine, setNewCommentLine] = useState(undefined as undefined | number);

  let fileSource = useDataSource(() => getFile(repoId ? repoId : "", filePath));
  let commentsSource = useDataSource(() => getComments(repoId ? repoId : "", filePath));

  if (!repoId || !repoName) {
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

  const onClickComment = (comment: string) => {
    postComment(repoId, filePath, newCommentLine, undefined, comment)
      .then(() => {
        commentsSource.forceRefetch();
        setNewCommentLine(undefined);
      });
  };

  const dirHref = routes.getRepoDir(getUsername(), repoId, repoName, getNextDirUp(filePath));

  return <ContentArea>
    <Link to={dirHref}><Button>Back To Folder</Button></Link>
    <Typography>{filePath}</Typography>
    {commentInformation}
    <table>
      <tbody>
        {getFileComponents(filePath,
          fileSource.data,
          commentsSource.data ? commentsSource.data : new Map(),
          newCommentLine,
          setNewCommentLine,
          onClickComment)}
      </tbody>
    </table>
  </ContentArea>
};

function getFileComponents(filePath: string, fileContents: string, commentsMap: Map<number, Comment[]>,
                           newCommentLine: number | undefined, onLineClicked: (lineNumber: number) => void,
                           onNewComment: (text: string) => void) {
  let lines = fileContents.split("\n");
  let components: JSX.Element[] = [];
  let lastLine = 0;
  let key = 0;
  const language = getFileExtension(getFileName(filePath));

  lines.forEach((line, index) => {
    components.push(<CodeSection language={language}
                                 lineNumber={index}
                                 lines={line}
                                 onLineClicked={onLineClicked}
                                 key={key++}/>);
    if (commentsMap.has(index)) {
      (commentsMap.get(index) as Comment[]).forEach(comment => {
        components.push(<FileComment key={key++} comment={comment}/>)
      });
    }
    if (index === newCommentLine) {
      components.push(<InlineSection><AddComment onClick={onNewComment}/></InlineSection>)
    }
  });

  return components;
}

interface AddCommentProps {
  onClick: (text: string) => void;
}

const AddComment = (props: AddCommentProps) => {
  const [comment, setComment] = useState("");

  return <>
    <Input.TextArea value={comment} onChange={(e) => setComment(e.target.value)}/>
    <Button onClick={() => props.onClick(comment)}>Comment</Button>
  </>
};

const InlineSection = styled.div`
  border: #e8e8e8 1px solid;
  margin: 16px;
  padding: 16px;
`;

interface CommentProps {
  comment: Comment
}

const FileComment = (props: CommentProps) => {
  return <InlineSection>
    <AntdComment content={<p>{props.comment.contents}</p>} author={props.comment.author_pseudonym}/>
  </InlineSection>
};

interface CodeSectionProps {
  language: string;
  lineNumber: number;
  lines: string;
  onLineClicked: (lineClicked: number) => void;
}

const CodeSection = (props: CodeSectionProps) => {
  return <tr onClick={() => props.onLineClicked(props.lineNumber)}>
    <td>
      <HoverablePre className="line-numbers"
                    data-start={props.lineNumber}
                    style={{paddingTop: 0, paddingBottom: 0, margin: 0, border: "none"}}>
        <code className={"language-" + props.language + " hoverableCode"}>
          {props.lines !== "" ? props.lines : " "}
        </code>
      </HoverablePre>
    </td>
  </tr>
};

const HoverablePre = styled.pre`
  &:hover {
    background-color: #bae7ff;
  }
`;

export default RepoFile;