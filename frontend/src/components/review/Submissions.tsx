import * as React from "react";
import { getReviewStats } from "../../utils/reviewApi";
import { useEffect, useState } from "react";
import { ReviewStats } from "../../types/ReviewStats";
import { List, Typography } from "antd";
import ReviewInfo from "./ReviewInfo";
import styled from "styled-components";

const Submissions = () => {
  const [reviewStats, setReviewStats] = useState(undefined as undefined | ReviewStats[]);

  useEffect(() => {
     getReviewStats()
       .then(setReviewStats)
       .catch(error => {
         console.log(error);
       });
  }, []);

  if (!reviewStats) {
    return <Typography>Loading...</Typography>
  }

  return <StyledDiv>
    <List dataSource={reviewStats}
               renderItem={stats => <List.Item><ReviewInfo reviewUrl={""} reviewStats={stats}/></List.Item>}
    />
  </StyledDiv>
};

const StyledDiv = styled.div`
  width: 600px;
`;

export default Submissions;