import * as React from "react"
import ViewRepos from "../ViewRepos/ViewRepos";
import { Typography } from "antd";
import NewRepo from "../ViewRepos/NewRepo";
import { useParams } from "react-router-dom";
import ReviewList from "../../review/ReviewList";
import { getReviewStats, getReviewSubmissionStats } from "../../../utils/reviewApi";
import ReviewerPools from "../../review/ReviewerPools";
import styled from "styled-components";
import BodyDiv from "../../styles/BodyDiv";

const { Title } = Typography;

// TODO - get username
const Home = () => {
  const {user} = useParams();

  return (
    <BodyDiv>

      <Bordered>
        <Title level={2}>Your repos:</Title>
        <ViewRepos/>
      </Bordered>

      <Bordered>
        <Title level={2}>Create Repository:</Title>
        <NewRepo/>
      </Bordered>

      <Bordered>
        <Title level={2}>Your submissions:</Title>
        <ReviewList getReviews={getReviewSubmissionStats}/>
      </Bordered>

      <Bordered>
        <Title level={2}>Your reviews:</Title>
        <ReviewList getReviews={getReviewStats}/>
      </Bordered>

      <Bordered>
        <Title level={2}>Your reviewer pools</Title>
        <ReviewerPools/>
      </Bordered>
    </BodyDiv>
  )
};

const Bordered = styled.div`
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom-style: solid;
  border-bottom-color: #e6e6e6;
  border-bottom-width: 1px;
`;

export default Home
