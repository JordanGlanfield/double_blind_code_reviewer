import React, {useState} from "react";
import {RouteComponentProps, useParams} from "react-router-dom";
import {List, Typography} from "antd";
import RepoEntry from "./RepoEntry";
import routes from "../../../constants/routes";
import {extractPathFromRoute, getNextDirUp} from "../../../utils/route_util";
import {getFile} from "../../../utils/repoApi";

interface Props extends RouteComponentProps {
}

interface DirEntry {
    name: string,
    isDir: boolean,
    href: string
}

const ViewRepo = (props: Props) => {
    const [dirContents, setDirContents] = useState([] as DirEntry[]);

    let {user, repo} = useParams();
    let currentDir = extractPathFromRoute(props);
    let atTopLevel = currentDir === "";

    if (!user) {
        return <div>
            {user}: Invalid user
        </div>
    }

    if (!repo) {
        return <div>
            {repo}: No such repository exists
        </div>
    }

    let directory;

    if (dirContents.length == 0) {
        try {
            getFile(repo, currentDir).then(directory => {
                const newDirContents = [];

                if (!atTopLevel) {
                    newDirContents.push({name: "..",
                        isDir: true,
                        href: routes.getRepoDir(user as string, repo as string) + getNextDirUp(currentDir)})
                }

                for (let dir of directory.directories) {
                    newDirContents.push({name: dir,
                        isDir: true,
                        href: routes.getRepoDir(user as string, repo as string) + currentDir + "/" + dir})
                }

                for (let file of directory.files) {
                    newDirContents.push({name: file,
                        isDir: false,
                        href: routes.getRepoFile(user as string, repo as string) + currentDir + "/" + file})
                }
                setDirContents(newDirContents);
            })
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


export default ViewRepo;