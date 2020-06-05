import * as React from "react"
import { ReviewStats } from "../../types/ReviewStats";
import { Button, Space } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ClonePrompt from "../routes/ViewRepos/ClonePrompt";
import { CommentOutlined } from "@ant-design/icons";

interface Props {
  ghostButton: boolean;
  reviewUrl: string;
  reviewStats: ReviewStats;
  isReceiver: boolean;
  hasReceivedFeedback?: boolean;
}

const ReviewInfo = (props: Props) => {
  const {reviewUrl, reviewStats} = props;
  // const approvalsMessage = "" + reviewStats.approvals + " approvals";
  // const rejectionsMessage = "" + reviewStats.rejections + " rejections";

  return <BoundingDiv><Space>
    <Link to={reviewUrl}>
      <Button type="primary" ghost={props.ghostButton}>
        {reviewStats.review_name + " | " + reviewStats.repo_name}
      </Button> {props.hasReceivedFeedback && "View Feedback" }
    </Link>
    {!props.isReceiver &&
        <ClonePrompt name={reviewStats.repo_name} clone_url={reviewStats.clone_url}/>
    }
    {/*<Col span={6}>*/}
    {/*    <Tag color="yellow">{reviewStats.status}</Tag>*/}
    {/*</Col>*/}
    {/*<Col span={6}>*/}
    {/*  <Tag color={reviewStats.approvals ? "green" : undefined}>{approvalsMessage}</Tag>*/}
    {/*</Col>*/}
    {/*<Col span={6}>*/}
    {/*  <Tag color={reviewStats.rejections ? "red" : undefined}>{rejectionsMessage}</Tag>*/}
    {/*</Col>*/}
  </Space></BoundingDiv>
};

const BoundingDiv = styled.div`
  width: 100%;
`;

export default ReviewInfo;