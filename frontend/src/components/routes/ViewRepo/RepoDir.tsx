import React, { useState } from "react";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import { List, PageHeader, Typography } from "antd";
import RepoEntry from "./RepoEntry";
import routes from "../../../constants/routes";
import { extractPathFromRoute, getNextDirUp } from "../../../utils/routeUtil";
import { getDir } from "../../../utils/repoApi";
import { useDataSource } from "../../../utils/hooks";
import { getUsername } from "../../../utils/authenticationService";
import ContentArea from "../../styles/ContentArea";

interface Props extends RouteComponentProps {
}

interface DirEntry {
  name: string,
  isDir: boolean,
  href: string
}

const RepoDir = (props: Props) => {
  let {repoId, repoName} = useParams();
  let currentDir = extractPathFromRoute(props);

  const dirSource = useDataSource(() => getDir(repoId ? repoId : "", currentDir));
  const [redirect, setRedirect] = useState(undefined as undefined | string);

  if (!repoId || !repoName) {
    return <Redirect to={{
      pathname: routes.HOME,
      state: { from: props.location }
    }}/>
  }

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  let dirContents: DirEntry[];

  if (dirSource.isFetching) {
    dirContents = [];
  } else if (!dirSource.data) {
    return <Typography>Failed to fetch repository data</Typography>;
  } else {
    dirContents = getDirectoryEntries(getUsername(), repoId, repoName, currentDir, dirSource.data);
  }

  return <>
    <PageHeader title={`Currently Viewing: ${repoName}`} onBack={() => setRedirect(routes.getHome(getUsername()))}/>
    <ContentArea>
      <Typography>Current directory: {currentDir === "" ? "/" : ""}{currentDir}</Typography>
      <List
        dataSource={dirContents}
        renderItem={item => <List.Item>
          <RepoEntry name={item.name}
                     isDir={item.isDir}
                     href={item.href}
                     onClick={dirSource.forceRefetch}
          />
        </List.Item>}
      />
    </ContentArea>
  </>
};

function stringCompare(s1: string, s2: string): number {
  return s1.toLowerCase() < s2.toLowerCase() ? -1 : 1;
}

function getDirectoryEntries(user: string, repoId: string, repoName: string, currentDir: string, directory: any)
    : DirEntry[] {
  const atTopLevel = currentDir === "";

  const dirEntries = [];

  if (!atTopLevel) {
    dirEntries.push({
      name: "..",
      isDir: true,
      href: routes.getRepoDir(user, repoId, repoName, getNextDirUp(currentDir))
    })
  }

  let path = currentDir;

  if (currentDir !== "") {
    path = currentDir + "/";
  }

  for (let dir of directory.directories.sort(stringCompare)) {
    dirEntries.push({
      name: dir,
      isDir: true,
      href: routes.getRepoDir(user, repoId, repoName, path + dir)
    })
  }

  for (let file of directory.files.sort(stringCompare)) {
    dirEntries.push({
      name: file,
      isDir: false,
      href: routes.getRepoFile(user, repoId, repoName, path + file)
    })
  }
  return dirEntries;
}

export default RepoDir;