import { Form, Input, Radio, Select, Typography } from "antd";
import React from "react";
import DbcrForm, { DbcrFormSubmit } from "../../util/DbcrForm";
import { getRelatedUsers, isReviewFeedbackComplete, submitReviewFeedback } from "../../../utils/reviewApi";
import { useDataSource } from "../../../utils/hooks";
import User from "../../../types/User";

interface Props {
  reviewId: string;
}

const ReviewFeedbackForm = (props: Props) => {
  const isFeedbackCompleteSource = useDataSource(() => isReviewFeedbackComplete(props.reviewId));
  const relatedUsersSource = useDataSource(getRelatedUsers);
  const onFinish = (values: any) => {
    submitReviewFeedback(props.reviewId, values.constructiveness, values.specificity, values.justification,
      values.politeness, values.feedback ? values.feedback : "", values.sureness, values.reviewer, values.reason)
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
    <Form.Item label="Was the review constructive? Was it helpful and explained how to improve your code?" name="constructiveness" required={true}>
      <Radio.Group>
        <Radio value={0}>No needs more work</Radio>
        <Radio value={1}>Somewhat</Radio>
        <Radio value={2}>Yes it was great</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Was the review specific? Did it point out specific examples in your code?" name="specificity" required={true}>
      <Radio.Group>
        <Radio value={0}>No needs more work</Radio>
        <Radio value={1}>Somewhat</Radio>
        <Radio value={2}>Yes it was great</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Did the review provide justifications, reasons and arguments?" name="justification" required={true}>
      <Radio.Group>
        <Radio value={0}>No needs more work</Radio>
        <Radio value={1}>Somewhat</Radio>
        <Radio value={2}>Yes it was great</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Was the review polite and friendly?" name="politeness" required={true}>
      <Radio.Group>
        <Radio value={0}>It was too harsh</Radio>
        <Radio value={1}>It was neutral</Radio>
        <Radio value={2}>It was friendly</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Do you have any other comments on the review?" name="feedback">
      <Input.TextArea rows={4} />
    </Form.Item>
    <Form.Item label="Could you tell who the reviewer was?" name="sureness" required={true}>
      <Radio.Group>
        <Radio value={0}>No</Radio>
        <Radio value={1}>I have a guess</Radio>
        <Radio value={2}>I'm sure</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Reviewer" name="reviewer" required={false}>
      <Select>
        {relatedUsersSource.data && relatedUsersSource.data.map((user: User) =>
          <Select.Option key={user.username} value={user.username}>
            {user.first_name + " " + user.surname}
          </Select.Option>)}
      </Select>
    </Form.Item>
    <Form.Item label="How could you tell?" name="reason" required={false}>
      <Input.TextArea rows={4} />
    </Form.Item>
    <DbcrFormSubmit labelSpan={8} wrapperColSpan={16} buttonText="Submit Review" />
  </DbcrForm>
};

export default ReviewFeedbackForm;