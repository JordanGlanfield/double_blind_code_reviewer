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
              <Typography>Clone: </Typography>
              <CloneInput value={cloneString} onFocus={event => event.target.select()}/>
            </Space>
          </List.Item>
        }}
    />
};

const CloneInput = styled(Input)`
  width: 70ch;
`;

export default ViewRepos