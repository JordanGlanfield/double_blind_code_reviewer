import React from "react";
import { useDataSourceWithMessages } from "../../utils/hooks";
import { addUserToPool, getReviewerPool, removeUserFromPool } from "../../utils/reviewApi";
import { Button, Descriptions, Form, Input, List, Space, Typography } from "antd";
import { getUsername } from "../../utils/authenticationService";
import User from "../../types/User";
import ReviewerPool from "../../types/ReviewerPool";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons/lib";


const ReviewerPoolDashboard = () => {
  const {user, pool} = useParams();

  const poolSource = useDataSourceWithMessages(() => getReviewerPool(pool ? pool : ""));

  if (poolSource.message) {
    return <Typography>{poolSource.message}</Typography>
  }

  const reviewerPool: ReviewerPool = poolSource.data;

  const addUser = (values: any) => {
    addUserToPool(reviewerPool.name, values.username).then(poolSource.forceRefetch);
  };

  const removeUser = (member: User) => {
    removeUserFromPool(reviewerPool.name, member.username).then(poolSource.forceRefetch);
  };

  const sortedMembers = reviewerPool.members.sort((a, b) =>
    a.username.toLowerCase().localeCompare(b.username.toLowerCase()));

  return <>
    <DescriptionsDiv>
      <Typography.Title level={4}>Pool Details</Typography.Title>
      <Descriptions>
        <Descriptions.Item label="Name">{reviewerPool.name}</Descriptions.Item>
        <Descriptions.Item label="Description">{reviewerPool.description}</Descriptions.Item>
        <Descriptions.Item label="Owner">{reviewerPool.owner.username}</Descriptions.Item>
      </Descriptions>
    </DescriptionsDiv>
    {reviewerPool.owner.username === getUsername() &&
      <>
        <Typography.Title level={4}>Add User</Typography.Title>
        <Form title="Add Users" labelCol={{span: 4}} wrapperCol={{span: 16}} onFinish={addUser}>
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{offset: 4, span: 16}}>
            <Button type="primary" htmlType="submit">Add User</Button>
          </Form.Item>
        </Form>
      </>
    }
    <Typography.Title level={4}>Users</Typography.Title>
    <List dataSource={sortedMembers}
          renderItem={(member: User) => <UserDiv><List.Item
            actions={[member.username !== getUsername() &&
              <Button type="danger" onClick={() => removeUser(member)}>
                {<DeleteOutlined />} Remove User
              </Button>
            ]}>
            <UsernameSpan><Typography.Text strong>{member.username}</Typography.Text></UsernameSpan>
          </List.Item></UserDiv>}
    />
  </>
};

const DescriptionsDiv = styled.div`
  margin-bottom: 20px;
  border-bottom: #dbdbdb;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`;

const UserDiv = styled.div`
  max-width: 400px;
`;

const UsernameSpan = styled.span`
  margin-left: 20px;
`;


export default ReviewerPoolDashboard;