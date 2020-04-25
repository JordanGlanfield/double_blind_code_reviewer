import * as React from "react"
import { ReviewStats } from "../../types/ReviewStats";
import { Badge, Button, Col, Row, Tag } from "antd";
import styled from "styled-components";
import { BellFilled } from "@ant-design/icons/lib";
import { Centered } from "../styles/Centered";

interface Props {
  reviewUrl: string,
  reviewStats: ReviewStats
}

const ReviewInfo = (props: Props) => {
  const {reviewUrl, reviewStats} = props;
  const approvalsMessage = "" + reviewStats.approvals + " approvals";
  const rejectionsMessage = "" + reviewStats.rejections + " rejections";

  return <BoundingDiv><Row>
    <Col span={6}>
      <LeftAligned>
        <Button href={reviewUrl}>{reviewStats.repoName}</Button>
      </LeftAligned>
    </Col>
    <Col span={6}>
      <LeftAligned>
        <BellFilled />
        <Badge count={reviewStats.newComments} />
      </LeftAligned>
    </Col>
    <Col span={6}>
      <Tag color={reviewStats.approvals ? "green" : undefined}>{approvalsMessage}</Tag>
    </Col>
    <Col span={6}>
      <Tag color={reviewStats.rejections ? "red" : undefined}>{rejectionsMessage}</Tag>
    </Col>
  </Row></BoundingDiv>
};

const BoundingDiv = styled.div`
  width: 100%;
`;

const LeftAligned = styled.div`
  text-align: left;
`

export default ReviewInfo;