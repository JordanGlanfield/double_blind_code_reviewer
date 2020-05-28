import React from "react";
import { useDataSource } from "../../../utils/hooks";
import { getReviewFeedback } from "../../../utils/reviewApi";
import { List, Typography } from "antd";
import ReviewFeedback from "../../../types/ReviewFeedback";
import styled from "styled-components";

interface Props {
  review_id: string;
}

enum FeedbackQuestion {
  Constructiveness = "Was the review constructive? Was it helpful and explained how to improve your code?",
  Specificity = "Was the review specific? Did it point out specific examples in your code?",
  Justification = "Did the review provide justifications, reasons and arguments?",
  Politeness = "Was the review polite and friendly?",
  Feedback = "Do you have any other comments on the review?"
}

const feedbackMap = new Map([
  [0, "No needs more work"],
  [1, "Somewhat"],
  [2, "Yes it was great"]
]);

const politenessMap = new Map([
  [0, "It was too harsh"],
  [1, "It was neutral"],
  [2, "It was friendly"]
]);

const ReviewFeedbackView = (props: Props) => {
  const feedbackSource = useDataSource(() => getReviewFeedback(props.review_id))

  if (feedbackSource.isFetching || !feedbackSource.data) {
    return <></>
  }

  const reviewFeedback = feedbackSource.data as ReviewFeedback;
  const generalListItems = getGeneralListItems(reviewFeedback);

  return <FeedbackDiv>
    <Typography.Title level={3}>Feedback received:</Typography.Title>
    <List itemLayout="horizontal">
      {generalListItems}
      <List.Item>
        <List.Item.Meta title={FeedbackQuestion.Politeness}
                        description={politenessMap.get(reviewFeedback.politeness)} />
      </List.Item>
      <List.Item>
        <List.Item.Meta title={FeedbackQuestion.Feedback}
                        description={reviewFeedback.feedback} />
      </List.Item>
    </List>
  </FeedbackDiv>
};

function getGeneralListItems(reviewFeedback: ReviewFeedback) {
  return [
    [reviewFeedback.constructiveness, FeedbackQuestion.Constructiveness],
    [reviewFeedback.specificity, FeedbackQuestion.Specificity],
    [reviewFeedback.justification, FeedbackQuestion.Justification]
  ].map(pair => <List.Item>
    <List.Item.Meta title={pair[1]} description={feedbackMap.get(pair[0] as number)} />
  </List.Item>)
}

const FeedbackDiv = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: #cccccc 1px solid;
`;

export default ReviewFeedbackView;
