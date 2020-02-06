import React, {useState} from "react";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import {List, Typography} from "antd";
import RepoEntry from "./RepoEntry";
import routes from "../../../constants/routes";
import {extractPathFromRoute, getNextDirUp} from "../../../utils/routeUtil";
import {getDir} from "../../../utils/repoApi";

interface Props extends RouteComponentProps {
}

interface DirEntry {
    name: string,
    isDir: boolean,
    href: string
}

const RepoDir = (props: Props) => {
    const [dirContents, setDirContents] = useState([] as DirEntry[]);

    let {user, repo} = useParams();
    let currentDir = extractPathFromRoute(props);

    if (!user || !repo) {
        return <Redirect to={{
            pathname: routes.HOME,
            state: {from: props.location}
        }} />
    }

    if (dirContents.length == 0) {
        try {
            getDirectoryEntries(user, repo, currentDir, setDirContents);
        } catch (err) {
            console.log(err);
            return <div>
                There was a problem.
            </div>
        }

        return <div>
            Loading...
        </div>
    }

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

function getDirectoryEntries(user: string, repo: string, currentDir: string,
                             callback: (dirEntries: DirEntry[]) => void) {
    const atTopLevel = currentDir === "";
    console.log(currentDir)
    getDir(repo, currentDir).then(directory => {
        const dirEntries = [];

        if (!atTopLevel) {
            dirEntries.push({name: "..",
                isDir: true,
                href: routes.getRepoDir(user, repo, getNextDirUp(currentDir))})
        }

        let path = currentDir;

        if (currentDir !== "") {
            path = currentDir + "/";
        }

        for (let dir of directory.directories) {
            dirEntries.push({name: dir,
                isDir: true,
                href: routes.getRepoDir(user, repo, path + dir)})
        }

        for (let file of directory.files) {
            dirEntries.push({name: file,
                isDir: false,
                href: routes.getRepoFile(user, repo, path + file)})
        }
        callback(dirEntries);
    })
}

export default RepoDir;