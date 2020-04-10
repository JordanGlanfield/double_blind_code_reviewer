import * as React from "react"
import { ReviewStats } from "../../types/ReviewStats";
import { Badge, Button, Tag } from "antd";

interface Props {
  reviewUrl: string,
  reviewStats: ReviewStats
}

const ReviewInfo = (props: Props) => {
  const {reviewUrl, reviewStats} = props;
  const approvalsMessage = "" + reviewStats.approvals + " approvals";
  const rejectionsMessage = "" + reviewStats.rejections + " rejections";

  return <>
    <Button type={"primary"}
            href={reviewUrl}>
      {reviewStats.repoName} | {reviewStats.branch}
    </Button>
    <Badge count={reviewStats.newComments}/>
    <Tag color={reviewStats.approvals ? "green" : undefined}>{approvalsMessage}</Tag>
    <Tag color={reviewStats.rejections ? "red" : undefined}>{rejectionsMessage}</Tag>
  </>
};

export default ReviewInfo;