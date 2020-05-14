import * as React from "react"
import { Link, useParams } from "react-router-dom";

import { Button, List, Typography, Space, Input } from "antd"
import routes from "../../../constants/routes";
import { getRepos } from "../../../utils/repoApi";
import { useDataSourceWithMessages } from "../../../utils/hooks";
import Repo from "../../../types/Repo";
import styled from "styled-components";

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
        renderItem={repo => {
          let cloneString = "git clone " + repo.clone_url + " " + repo.name
          return <List.Item>
            <Space>
              <Link to={routes.getRepoDir(userString, repo.id, repo.name,"")}>
                <Button type="primary" ghost>{repo.name}</Button>
              </Link>
              <ClonableText>
                <Typography.Paragraph copyable>{cloneString}</Typography.Paragraph>
              </ClonableText>
            </Space>
          </List.Item>
        }}
    />
};

const ClonableText = styled.div`
  font-size: 13pt;
  vertical-align: center;
  padding: 5px 0;
  margin-top: 1em;
`;

export default ViewRepos