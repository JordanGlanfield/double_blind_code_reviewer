import React from "react";
import { useDataSourceWithMessages } from "../../utils/hooks";
import { addUserToPool, getReviewerPool } from "../../utils/reviewApi";
import { Button, Descriptions, Form, Input, List, Typography } from "antd";
import { getUsername } from "../../utils/authenticationService";
import User from "../../types/User";
import ReviewerPool from "../../types/ReviewerPool";
import styled from "styled-components";
import { useParams } from "react-router-dom";


const ReviewerPoolDashboard = () => {
  const {user, pool} = useParams();

  const poolSource = useDataSourceWithMessages(() => getReviewerPool(pool ? pool : ""));

  if (poolSource.message) {
    return <Typography>{poolSource.message}</Typography>
  }

  const reviewerPool: ReviewerPool = poolSource.data;
  const addUser = (values: any) => {
    addUserToPool(reviewerPool.name, values.username);
    poolSource.forceRefetch();
  };

  console.log(reviewerPool.owner);

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
    <List dataSource={reviewerPool.members}
          renderItem={(member: User) => <>
            <Typography.Text strong>{member.username}</Typography.Text>
          </>}
    />
  </>
};

const DescriptionsDiv = styled.div`
  margin-bottom: 20px;
  border-bottom: #dbdbdb;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`;

export default ReviewerPoolDashboard;