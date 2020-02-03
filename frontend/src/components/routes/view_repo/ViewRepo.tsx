import React, { useState } from "react";
import { useParams, RouteComponentProps } from "react-router-dom";
import { List, Typography } from "antd";
import RepoEntry from "./RepoEntry";
import routes from "../../../constants/routes";
import { extractPath } from "../../../utils/route_util";

interface Props extends RouteComponentProps {
}

interface DirEntry {
    name: string,
    isDir: boolean
}

async function get(uriSuffix: string) {
    const requestOptions = {
        method: "GET"
    };

    const response = await fetch("/api/v1.0/repos/view" + uriSuffix);

    if (response.ok) {
        return await response.json();
    }

    throw response
}

function getDirectory(repoId: string, path: string) {
    // TODO - safety of using path here?
    return get("/" + repoId + "/" + path)
}

const ViewRepo = (props: Props) => {
    const [dirContents, setDirContents] = useState([] as DirEntry[]);

    let {user, repo} = useParams();
    let currentDir = extractPath(props.match.url, props.location.pathname);

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
            getDirectory(repo, currentDir).then(directory => {
                const newDirContents = [];

                for (let dir of directory.directories) {
                    newDirContents.push({ name: dir, isDir: true })
                }

                for (let file of directory.files) {
                    newDirContents.push({ name: file, isDir: false })
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
                         href={item.isDir
                           ? routes.getRepoDir(user as string, repo as string) + currentDir + "/" + item.name
                           : routes.getRepoFile(user as string, repo as string) + currentDir + "/" + item.name
                         }
              />
          </List.Item>}
        />
    </div>;
};


export default ViewRepo;