import * as React from "react";
import { ReviewStats } from "../../types/ReviewStats";
import { List, Typography } from "antd";
import ReviewInfo from "./ReviewInfo";
import { useDataSourceWithMessages } from "../../utils/hooks";
import { getUsername } from "../../utils/authenticationService";
import routes from "../../constants/routes";

interface Props {
  getReviews: () => Promise<ReviewStats[]>;
  isReceiver: boolean;
  showFeedback?: boolean;
  ghostButton: boolean;
}

const ReviewList = (props: Props) => {
  const {data, message} = useDataSourceWithMessages(props.getReviews);

  if (message) {
    return <Typography>{message}</Typography>;
  }

  return <List size="large"
               dataSource={data}
               locale={{ emptyText: <></>}}
               renderItem={(stats: ReviewStats) => <List.Item><ReviewInfo
                 ghostButton={props.ghostButton}
                 reviewUrl={routes.getRepoDir(getUsername(), stats.review_id, stats.repo_id, stats.repo_name, "")}
                 reviewStats={stats}
                 isReceiver={props.isReceiver}
                 hasReceivedFeedback={stats.has_feedback && props.showFeedback}
               /></List.Item>}
  />
};

export default ReviewList;