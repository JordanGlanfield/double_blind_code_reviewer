import { Form, Input, Radio, Select, Typography } from "antd";
import React from "react";
import DbcrForm, { DbcrFormSubmit } from "../../util/DbcrForm";
import { getRelatedUsers, isReviewComplete, submitReviewerAnonymisationFeedback } from "../../../utils/reviewApi";
import { useDataSource } from "../../../utils/hooks";
import User from "../../../types/User";

interface Props {
  reviewId: string;
}

const ReviewForm = (props: Props) => {
  const relatedUsersSource = useDataSource(getRelatedUsers);
  const isReviewCompleteSource = useDataSource(() => isReviewComplete(props.reviewId));
  const onFinish = (values: any) => {
    submitReviewerAnonymisationFeedback(props.reviewId, values.sureness, values.submitter, values.reason)
      .then(isReviewCompleteSource.forceRefetch)
      .catch(error => alert(error));
  };

  if (isReviewCompleteSource.isFetching) {
    return <></>
  }

  if (isReviewCompleteSource.data) {
    return <Typography>You have submitted your review</Typography>
  }

  return <DbcrForm labelSpan={20} wrapperColSpan={20} title="Submit Review" layout="vertical" onFinish={onFinish}>
    {/*<Form.Item label="General Feedback" name="Feedback">*/}
    {/*  <Input.TextArea rows={4} />*/}
    {/*</Form.Item>*/}
    <Form.Item label="Could you tell who the submitter was?" name="sureness" required={true}>
      <Radio.Group>
        <Radio value={0}>No</Radio>
        <Radio value={1}>I have a guess</Radio>
        <Radio value={2}>I'm sure</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Submitter" name="submitter" required={false}>
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



export default ReviewForm;