import React, {useState} from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {Button, Typography} from "antd";
import {extractPathFromRoute, getNextDirUp} from "../../../utils/routeUtil";
import { RouteComponentProps, useParams } from "react-router-dom";
import { getFile } from "../../../utils/repoApi";
import routes from "../../../constants/routes";

interface Props extends RouteComponentProps {
}

// TODO - add mapping from file extension to language
const RepoFile = (props: Props) => {
  const [fileContents, setFileContents] = useState(undefined as string | undefined);
  const {user, repo} = useParams();
  const filePath = extractPathFromRoute(props);

  if (!user) {
    return <div>Invalid user: {user}</div>
  }

  if (!repo) {
    return <div>Invalid repo: {repo}</div>
  }

  if (!fileContents) {
    getFile(repo, filePath).then(file => {
      setFileContents(file);
    });

    return <div>Loading...</div>
  }

  const dirHref = routes.getRepoDir(user, repo, getNextDirUp(filePath));

  return <div>
    <Button href={dirHref}>Back To Folder</Button>
    <Typography>{filePath}</Typography>
    <SyntaxHighlighter language={"text"}>
      {fileContents}
    </SyntaxHighlighter>
  </div>
};

export default RepoFile;