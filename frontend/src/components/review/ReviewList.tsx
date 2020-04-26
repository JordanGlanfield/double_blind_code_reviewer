import * as React from "react";
import { ReviewStats } from "../../types/ReviewStats";
import { List, Typography } from "antd";
import ReviewInfo from "./ReviewInfo";
import { useDataSourceWithMessages } from "../../utils/hooks";

interface Props {
  getReviews: () => Promise<ReviewStats[]>
}

const ReviewList = (props: Props) => {
  const {data, message} = useDataSourceWithMessages(props.getReviews);

  if (message) {
    return <Typography>{message}</Typography>;
  }

  return <List size="large"
               dataSource={data}
               renderItem={stats => <List.Item><ReviewInfo reviewUrl={""} reviewStats={stats as ReviewStats}/></List.Item>}
  />
};

export default ReviewList;