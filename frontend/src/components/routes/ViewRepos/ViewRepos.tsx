import * as React from "react"
import { Link, useParams } from "react-router-dom";

import { Button, List, Typography } from "antd"
import routes from "../../../constants/routes";
import { getRepos } from "../../../utils/repoApi";
import { useDataSourceWithMessages } from "../../../utils/hooks";
import Repo from "../../../types/Repo";

const ViewRepos = () => {
    let repoSource = useDataSourceWithMessages(getRepos);
    let { user } = useParams();

    if (!user) {
        return <div />;
    }

    if (repoSource.message) {
        return <Typography>{repoSource.message}</Typography>
    }

    let userString: string = user;

    return <List
        size="large"
        dataSource={repoSource.data as Repo[]}
        renderItem={repo => <List.Item>
            <Link to={routes.getRepoDir(userString, repo.id, repo.name,"")}>
                <Button type="primary" ghost>{repo.name}</Button>
            </Link>
        </List.Item>}
    />
};

export default ViewRepos