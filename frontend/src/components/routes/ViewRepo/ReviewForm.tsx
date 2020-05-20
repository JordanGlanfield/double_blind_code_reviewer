import { Form, Input } from "antd";
import React from "react";
import DbcrForm, { DbcrFormSubmit } from "../../util/DbcrForm";
import { submitReview } from "../../../utils/reviewApi";

interface Props {
  reviewId: string;
}

const ReviewForm = (props: Props) => {

  const onFinish = () => submitReview(props.reviewId);

  return <DbcrForm title="Submit Review" onFinish={onFinish}>
    <Form.Item label="General Feedback" name="Feedback">
      <Input.TextArea rows={4} />
    </Form.Item>
    <DbcrFormSubmit buttonText="Submit Review" />
  </DbcrForm>
};

export default ReviewForm;