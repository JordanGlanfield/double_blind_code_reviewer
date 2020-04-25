import * as React from "react"
import ViewRepos from "../ViewRepos/ViewRepos";
import { Button, Typography } from "antd";
import ReviewList from "../../review/ReviewList";
import { getReviewStats, getReviewSubmissionStats } from "../../../utils/reviewApi";
import ReviewerPools from "../../review/ReviewerPools";
import styled from "styled-components";
import routes from "../../../constants/routes";
import { PlusOutlined } from "@ant-design/icons/lib";

const { Title } = Typography;

// TODO - get username
const Home = () => {
  return (
    <ContentArea>
      <Section>
        <Title level={2}>Your repositories:</Title>
        <NewRepoSection>
          <Button type="primary" href={routes.CREATE_REPO}><PlusOutlined /> Create New Repository</Button>
        </NewRepoSection>
        <ViewRepos />
      </Section>

      <Section>
        <Title level={2}>Reviews received:</Title>
        <ReviewList getReviews={getReviewSubmissionStats}/>
      </Section>

      <Section>
        <Title level={2}>Code to review:</Title>
        <ReviewList getReviews={getReviewStats}/>
      </Section>

      <Section>
        <Title level={2}>Your reviewer pools</Title>
        <ReviewerPools/>
      </Section>
    </ContentArea>
  )
};

const ContentArea = styled.div`
  background-color: white;
  margin-top: 32px;
  padding-top: 16px;
  padding-left: 32px;
  padding-right: 32px;
`;

const Bordered = styled.div`
  border-bottom: 1px solid #f0f0f0;
`;

const Section = styled(Bordered)`
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const NewRepoSection = styled(Bordered)`
  padding-left: 24px;
  padding-bottom: 16px;
`;

export default Home
