import { Button, Form, Input, Table, Typography } from "antd";
import React from "react";
import { useDataSourceWithMessages } from "../../utils/hooks";
import { createReviewerPool, getReviewerPools } from "../../utils/reviewApi";
import ReviewerPool from "../../types/ReviewerPool";
import styled from "styled-components";

const ReviewerPools = () => {
  let poolsSource = useDataSourceWithMessages(getReviewerPools);

  if (poolsSource.message) {
    return <Typography>{poolsSource.message}</Typography>
  }

  const tableData = (poolsSource.data as ReviewerPool[])
    .map((reviewerPool, index) => ({...reviewerPool, key: index}));

  const newPool = (values: any) => {
    createReviewerPool(values.name, values.description).then(poolsSource.forceRefetch);
  };

  const newPoolFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };

  return <>
    <TableDiv>
      <Table dataSource={tableData} showHeader={false} pagination={false}>
        <Table.Column dataIndex="name"
                      key="name"
                      colSpan={1}
                      render={name => <Button href={"TODO"}>{name}</Button>}
        />
        <Table.Column dataIndex="description"
                      key="description"
                      colSpan={8}
                      render={description => <DescriptionParagraph ellipsis>{description}</DescriptionParagraph>}
        />
        <Table.Column dataIndex="numMembers"
                      key="numMembers"
                      colSpan={1}
                      render={numMembers => <Typography>{numMembers} members</Typography>}
        />
        </Table>
    </TableDiv>
    <div>
      <Typography.Title level={3}>Create new reviewer pool</Typography.Title>
      <Form
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        name="new_pool"
        onFinish={newPool}
        onFinishFailed={newPoolFailed}
      >
        <Form.Item label="Pool Name"
                   name="name"
                   rules={[{required: true, message: "Enter a name for the pool"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="Pool Description"
                   name="description"
                   rules={[{required: true, message: "Enter a description for the pool"}]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">Create</Button>
        </Form.Item>
      </Form>
    </div>
  </>
};

const TableDiv = styled.div`
  max-width: 1000px;
`;

const DescriptionParagraph = styled(Typography.Paragraph)`
  max-width: 1000px
`;

export default ReviewerPools;