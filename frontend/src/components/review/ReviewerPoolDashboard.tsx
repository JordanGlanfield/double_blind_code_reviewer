import { useDataSourceWithMessages } from "../../utils/hooks";
import { addUserToPool, getReviewerPool } from "../../utils/reviewApi";
import { Button, Descriptions, Form, Input, List, Typography } from "antd";
import { getUsername } from "../../utils/authenticationService";
import User from "../../types/User";
import ReviewerPool from "../../types/ReviewerPool";
import styled from "styled-components";

interface Props {
  id: number
}

const ReviewerPoolDashboard = (props: Props) => {
  const poolSource = useDataSourceWithMessages(() => getReviewerPool(props.id));

  if (poolSource.message) {
    return <Typography>{poolSource.message}</Typography>
  }

  const pool: ReviewerPool = poolSource.data;
  const addUser = (values: any) => addUserToPool(values.id, values.username);

  return <>
    <DescriptionsDiv>
      <Descriptions>
        <Descriptions.Item>{pool.name}</Descriptions.Item>
        <Descriptions.Item>{pool.description}</Descriptions.Item>
        <Descriptions.Item>{pool.owner}</Descriptions.Item>
      </Descriptions>
    </DescriptionsDiv>
    {pool.owner.username === getUsername() &&
      <Form labelCol={{span: 4}} wrapperCol={{span: 16}} onFinish={addUser}>
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{offset: 4, span: 16}}>
          <Button type="primary" htmlType="submit">Add User</Button>
        </Form.Item>
      </Form>}
    <List dataSource={pool.members}
          renderItem={(member: User) => <Typography>{member.username}</Typography>}
    />
  </>
};

const DescriptionsDiv = styled.div`
  margin-bottom: 10px;
  border-bottom: #dbdbdb;
  border-bottom-width: 1px;
`;

export default ReviewerPoolDashboard;