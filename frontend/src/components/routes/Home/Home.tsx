import * as React from "react"
import ViewRepos from "../ViewRepos/ViewRepos";
import { Button, PageHeader, Typography } from "antd";
import ReviewList from "../../review/ReviewList";
import { getReviewStats, getReviewSubmissionStats } from "../../../utils/reviewApi";
import ReviewerPools from "../../review/ReviewerPools";
import styled from "styled-components";
import routes from "../../../constants/routes";
import { PlusOutlined } from "@ant-design/icons/lib";
import ContentArea from "../../styles/ContentArea";
import { Link } from "react-router-dom";

const { Title } = Typography;

// TODO - get username
const Home = () => {
  return <>
    <PageHeader title="DBCR Dashboard" />
    <ContentArea>
      <Section>
        <Title level={3}>Your repositories:</Title>
        <NewRepoSection>
          <Link to={routes.CREATE_REPO}><Button type="primary"><PlusOutlined /> Create New Repository</Button></Link>
        </NewRepoSection>
        <ViewRepos />
      </Section>

      <Section>
        <Title level={3}>Reviews received:</Title>
        <ReviewList getReviews={getReviewSubmissionStats}/>
      </Section>

      <Section>
        <Title level={3}>Code to review:</Title>
        <ReviewList getReviews={getReviewStats}/>
      </Section>

      <Section>
        <Title level={3}>Your reviewer pools</Title>
        <ReviewerPools/>
      </Section>
    </ContentArea>
  </>
};

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
