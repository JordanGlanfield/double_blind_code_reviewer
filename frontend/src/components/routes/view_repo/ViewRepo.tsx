import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { List } from "antd";

interface Props {
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

    if (!repo) {
        return <div>
            {repo}: No such repository exists
        </div>
    }

    let directory;

    if (dirContents.length == 0) {
        try {
            getDirectory(repo, "").then(directory => {
                const newDirContents = [];

                console.log(directory);

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
        <List
          dataSource={dirContents}
          renderItem={item => <List.Item>
              {item.isDir ? "Directory: " : "File: "} {item.name}
          </List.Item>}
        />
    </div>;
};

export default ViewRepo;