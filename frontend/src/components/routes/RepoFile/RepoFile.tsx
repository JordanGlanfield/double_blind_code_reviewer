import React, {useState} from "react";
import {Button, Typography} from "antd";
import { extractPathFromRoute, getFileExtension, getFileName, getNextDirUp } from "../../../utils/routeUtil";
import { RouteComponentProps, useParams } from "react-router-dom";
import { getFile } from "../../../utils/repoApi";
import routes from "../../../constants/routes";
import Highlight from "react-highlight.js";
import "./atom-one-light.min.css"

interface Props extends RouteComponentProps {
}

// TODO - add mapping from file extension to language
const RepoFile = (props: Props) => {
  const [fileContents, setFileContents] = useState(undefined as string | undefined);
  const {user, repo} = useParams();
  const filePath = extractPathFromRoute(props);

  if (!user || !repo) {
    return <div>Invalid parameters</div>;
  }

  if (fileContents === undefined) {
    getFile(repo, filePath).then(file => {
      setFileContents(file);
    });

    return <div>Loading...</div>
  }

  const dirHref = routes.getRepoDir(user, repo, getNextDirUp(filePath));

  return <div>
    <Button href={dirHref}>Back To Folder</Button>
    <Typography>{filePath}</Typography>
    <Highlight language={getFileExtension(getFileName(filePath))}>
      {fileContents}
    </Highlight>
  </div>
};

export default RepoFile;