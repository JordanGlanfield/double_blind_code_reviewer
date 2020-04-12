import { Button, Table, Typography } from "antd";
import React from "react";
import { useDataSourceWithMessages } from "../../utils/hooks";
import { getReviewerPools } from "../../utils/reviewApi";
import ReviewerPool from "../../types/ReviewerPool";
import styled from "styled-components";

const ReviewerPools = () => {
  let poolsSource = useDataSourceWithMessages(getReviewerPools);

  if (poolsSource.message) {
    return <Typography>{poolsSource.message}</Typography>
  }

  const tableData = (poolsSource.data as ReviewerPool[])
    .map((reviewerPool, index) => ({...reviewerPool, key: index}));

  return <TableDiv>
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
};

const TableDiv = styled.div`
  max-width: 1000px;
`;

const DescriptionParagraph = styled(Typography.Paragraph)`
  max-width: 1000px
`;

export default ReviewerPools;