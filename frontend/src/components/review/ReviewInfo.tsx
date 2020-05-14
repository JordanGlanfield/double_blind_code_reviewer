import * as React from "react"
import { ReviewStats } from "../../types/ReviewStats";
import { Badge, Button, Col, Row, Tag, Typography } from "antd";
import styled from "styled-components";
import { BellFilled } from "@ant-design/icons/lib";
import { Link } from "react-router-dom";

interface Props {
  reviewUrl: string,
  reviewStats: ReviewStats
}

const ReviewInfo = (props: Props) => {
  const {reviewUrl, reviewStats} = props;
  // const approvalsMessage = "" + reviewStats.approvals + " approvals";
  // const rejectionsMessage = "" + reviewStats.rejections + " rejections";

  return <BoundingDiv><Row>
    <Col span={6}>
      <LeftAligned>
        <Link to={reviewUrl}><Button type="primary" ghost>{reviewStats.repo_name}</Button></Link>
      </LeftAligned>
    </Col>
    <Col span={6}>
      <Typography>{reviewStats.repo_id}</Typography>
    </Col>
    <Col span={6}>
        <Tag color="yellow">{reviewStats.status}</Tag>
    </Col>
    {/*<Col span={6}>*/}
    {/*  <Tag color={reviewStats.approvals ? "green" : undefined}>{approvalsMessage}</Tag>*/}
    {/*</Col>*/}
    {/*<Col span={6}>*/}
    {/*  <Tag color={reviewStats.rejections ? "red" : undefined}>{rejectionsMessage}</Tag>*/}
    {/*</Col>*/}
  </Row></BoundingDiv>
};

const BoundingDiv = styled.div`
  width: 100%;
`;

const LeftAligned = styled.div`
  text-align: left;
`;

export default ReviewInfo;