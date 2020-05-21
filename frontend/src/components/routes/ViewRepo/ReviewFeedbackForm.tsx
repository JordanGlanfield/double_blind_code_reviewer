import { Form, Input, Radio, Typography } from "antd";
import React from "react";
import DbcrForm, { DbcrFormSubmit } from "../../util/DbcrForm";
import { isReviewFeedbackComplete, submitReviewFeedback } from "../../../utils/reviewApi";
import { useDataSource } from "../../../utils/hooks";
import RelevantUsersSelect from "./RelevantUsersSelect";

interface Props {
  reviewId: string;
}

const ReviewFeedbackForm = (props: Props) => {
  const isFeedbackCompleteSource = useDataSource(() => isReviewFeedbackComplete(props.reviewId));
  const onFinish = (values: any) => {
    submitReviewFeedback(props.reviewId, values.constructiveness, values.specificity, values.justification,
      values.politeness, values.sureness, values.reviewer, values.reason)
      .then(isFeedbackCompleteSource.forceRefetch)
      .catch(error => alert(error));
  };

  if (isFeedbackCompleteSource.isFetching) {
    return <></>
  }

  if (isFeedbackCompleteSource.data) {
    return <Typography>You have submitted your feedback</Typography>
  }

  return <DbcrForm labelSpan={20} wrapperColSpan={20} title="Submit Feedback" layout="vertical" onFinish={onFinish}>
    <Form.Item label="General Feedback" name="Feedback">
      <Input.TextArea rows={4} />
    </Form.Item>
    <Form.Item label="Was the review constructive? Was it helpful and explained how to improve your code?" name="constructiveness" required={true}>
      <FeedbackRadio />
    </Form.Item>
    <Form.Item label="Was the review specific? Did it point out specific examples in your code?" name="specificity" required={true}>
      <FeedbackRadio />
    </Form.Item>
    <Form.Item label="Did the review provide justifications, reasons and arguments?" name="justification" required={true}>
      <FeedbackRadio />
    </Form.Item>
    <Form.Item label="Was the review polite and friendly?" name="politeness" required={true}>
      <FeedbackRadio no="It was too harsh" somewhat="It was neutral" yes="It was friendly"/>
    </Form.Item>
    <Typography>Could you tell who the reviewer was?</Typography>
    <Form.Item label="Reviewer" name="reviewer" required={false}>
      <RelevantUsersSelect />
    </Form.Item>
    <Form.Item label="How could you tell?" name="reason" required={false}>
      <Input.TextArea rows={4} />
    </Form.Item>
    <DbcrFormSubmit labelSpan={20} wrapperColSpan={20} buttonText="Submit Review" />
  </DbcrForm>
};

interface FeedbackRadioProps {
  no?: string;
  somewhat?: string;
  yes?: string;
}

const FeedbackRadio = (props: FeedbackRadioProps) => {
  const no = props.no ? props.no : "No needs more work";
  const somewhat = props.somewhat ? props.somewhat : "Somewhat";
  const yes = props.yes ? props.yes : "Yes it was great";
  return <Radio.Group>
    <Radio value={0}>{no}</Radio>
    <Radio value={1}>{somewhat}</Radio>
    <Radio value={2}>{yes}</Radio>
  </Radio.Group>
};


export default ReviewFeedbackForm;