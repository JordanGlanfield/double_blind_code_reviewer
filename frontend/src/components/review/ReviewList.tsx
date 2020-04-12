import * as React from "react";
import { ReviewStats } from "../../types/ReviewStats";
import { List, Typography } from "antd";
import ReviewInfo from "./ReviewInfo";
import styled from "styled-components";
import { useDataSourceWithMessages } from "../../utils/hooks";

interface Props {
  getReviews: () => Promise<ReviewStats[]>
}

const ReviewList = (props: Props) => {
  const {data, message} = useDataSourceWithMessages(props.getReviews);

  if (message) {
    return <Typography>{message}</Typography>;
  }

  return <StyledDiv>
    <List dataSource={data}
               renderItem={stats => <List.Item><ReviewInfo reviewUrl={""} reviewStats={stats as ReviewStats}/></List.Item>}
    />
  </StyledDiv>
};

const StyledDiv = styled.div`
  width: 600px;
`;

export default ReviewList;