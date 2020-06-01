import { Button, Form, Input, Table, Typography } from "antd";
import React from "react";
import { useDataSourceWithMessages } from "../../utils/hooks";
import { createReviewerPool, getReviewerPools, joinReviewerPool } from "../../utils/reviewApi";
import ReviewerPoolSummary from "../../types/ReviewerPoolSummary";
import styled from "styled-components";
import { getUsername, hasAdminPrivileges } from "../../utils/authenticationService";
import routes from "../../constants/routes";
import { Link } from "react-router-dom";
import DbcrForm, { DbcrFormSubmit } from "../util/DbcrForm";

const ReviewerPools = () => {
  let poolsSource = useDataSourceWithMessages(getReviewerPools);

  if (poolsSource.message) {
    return <Typography>{poolsSource.message}</Typography>
  }

  const tableData = (poolsSource.data as ReviewerPoolSummary[])
    .map((reviewerPool, index) => ({...reviewerPool, key: index}));

  const newPool = (values: any) => {
    createReviewerPool(values.name, values.description, values.inviteCode).then(poolsSource.forceRefetch);
  };

  const newPoolFailed = (errorInfo: any) => {
    console.log(errorInfo);
    alert("Failed to create pool. Check console for more details.")
  };

  const joinPool = (values: any) => {
    joinReviewerPool(values.inviteCode)
      .then(poolsSource.forceRefetch)
      .catch(err => {
        console.log(err);
        alert("Unable to join pool. Check invite code and try again")
      });
  };

  const isAdmin = hasAdminPrivileges();

  return <>
    <TableDiv>
      <Table dataSource={tableData} showHeader={false} pagination={false} locale={{ emptyText: <></> }}>
        <Table.Column dataIndex="name"
                      key="name"
                      colSpan={1}
                      render={name =>
                        <Link to={routes.getReviewerPool(getUsername() as string, name)}><Button>{name}</Button></Link>}
        />
        <Table.Column dataIndex="description"
                      key="description"
                      colSpan={8}
                      render={description => <DescriptionParagraph ellipsis={{rows: 3, expandable: true}}>{description}</DescriptionParagraph>}
        />
        <Table.Column dataIndex="num_members"
                      key="numMembers"
                      colSpan={1}
                      render={numMembers => <MembersParagraph>{numMembers} members</MembersParagraph>}
        />
        </Table>
    </TableDiv>
    <FormDiv>
      {isAdmin && <><Typography.Title level={3}>Create new reviewer pool</Typography.Title>
      <DbcrForm
        title="Create new reviewer pool"
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
        <Form.Item label="Invitation Code"
                   name="inviteCode">
          <Input />
        </Form.Item>
        <DbcrFormSubmit buttonText="Create" />
      </DbcrForm></>}
      {!isAdmin && <><Typography.Title level={3}>Join a reviewer pool</Typography.Title>
        <DbcrForm title="Join reviewer pool" onFinish={joinPool}>
          <Form.Item label="Invite Code" name="inviteCode">
            <Input />
          </Form.Item>
          <DbcrFormSubmit buttonText="Join" />
        </DbcrForm></>}
    </FormDiv>
  </>
};

const TableDiv = styled.div`
  max-width: 1000px;
  margin-bottom: 20px;
`;

const DescriptionParagraph = styled(Typography.Paragraph)`
  max-width: 1000px
`;

const FormDiv = styled.div`
  max-width: 1000px;
`;

const MembersParagraph = styled(Typography.Paragraph)`
  width: 100px
`;

export default ReviewerPools;