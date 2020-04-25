import * as React from "react"
import { useParams } from "react-router-dom";

import { Button, List, Typography } from "antd"
import routes from "../../../constants/routes";
import { getRepos } from "../../../utils/repoApi";
import { useDataSourceWithMessages } from "../../../utils/hooks";

const ViewRepos = () => {
    let repoSource = useDataSourceWithMessages(getRepos);
    let { user } = useParams();

    if (!user) {
        return <div></div>;
    }

    if (repoSource.message) {
        return <Typography>{repoSource.message}</Typography>
    }

    let userString: string = user;

    return <List
        size="large"
        dataSource={repoSource.data as string[]}
        renderItem={item => <List.Item>
            <Button type="primary" ghost href={routes.getRepoDir(userString, item, "")}>{item}</Button>
        </List.Item>}
    />
};

export default ViewRepos