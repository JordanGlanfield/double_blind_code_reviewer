import React from "react";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import { List, Typography } from "antd";
import RepoEntry from "./RepoEntry";
import routes from "../../../constants/routes";
import { extractPathFromRoute, getNextDirUp } from "../../../utils/routeUtil";
import { getDir } from "../../../utils/repoApi";
import { useDataSourceWithMessages } from "../../../utils/hooks";

interface Props extends RouteComponentProps {
}

interface DirEntry {
  name: string,
  isDir: boolean,
  href: string
}

const RepoDir = (props: Props) => {
  let { user, repo } = useParams();
  let currentDir = extractPathFromRoute(props);

  let dirSource = useDataSourceWithMessages(() => getDir(repo ? repo : "", currentDir));

  if (!user || !repo) {
    return <Redirect to={{
      pathname: routes.HOME,
      state: { from: props.location }
    }}/>
  }

  if (dirSource.message) {
    return <Typography>{dirSource.message}</Typography>;
  }

  const dirContents = getDirectoryEntries(user, repo, currentDir, dirSource.data);

  return <div>
    <Typography>Current directory: {currentDir === "" ? "/" : ""}{currentDir}</Typography>
    <List
      dataSource={dirContents}
      renderItem={item => <List.Item>
        <RepoEntry name={item.name}
                   isDir={item.isDir}
                   href={item.href}
        />
      </List.Item>}
    />
  </div>;
};

function stringCompare(s1: string, s2: string): number {
  return s1.toLowerCase() < s2.toLowerCase() ? -1 : 1;
}

function getDirectoryEntries(user: string, repo: string, currentDir: string, directory: any): DirEntry[] {
  const atTopLevel = currentDir === "";

  const dirEntries = [];

  if (!atTopLevel) {
    dirEntries.push({
      name: "..",
      isDir: true,
      href: routes.getRepoDir(user, repo, getNextDirUp(currentDir))
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
      href: routes.getRepoDir(user, repo, path + dir)
    })
  }

  for (let file of directory.files.sort(stringCompare)) {
    dirEntries.push({
      name: file,
      isDir: false,
      href: routes.getRepoFile(user, repo, path + file)
    })
  }
  return dirEntries;
}

export default RepoDir;