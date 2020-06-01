import * as React from "react"
import { Link, useParams } from "react-router-dom";

import { Button, List, Space, Typography } from "antd"
import routes from "../../../constants/routes";
import { getRepos } from "../../../utils/repoApi";
import { useDataSourceWithMessages } from "../../../utils/hooks";
import Repo from "../../../types/Repo";
import styled from "styled-components";
import ClonePrompt from "./ClonePrompt";

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
        locale={{ emptyText: <></> }}
        renderItem={repo => {
          return <List.Item>
            <Space>
              <Link to={routes.getRepoDir(userString, undefined, repo.id, repo.name,"")}>
                <Button type="primary" ghost>{repo.name}</Button>
              </Link>
              <ClonePrompt name={repo.name} clone_url={repo.clone_url} />
            </Space>
          </List.Item>
        }}
    />
};

export default ViewRepos