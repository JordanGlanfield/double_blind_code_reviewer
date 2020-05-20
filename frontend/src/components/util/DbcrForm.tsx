import React, { FunctionComponent } from "react";
import { Button, Form, Input } from "antd";

interface Props {
  title: string;
  onFinish: (values: any) => void;
}

const DbcrForm: FunctionComponent<Props> = ({title, onFinish, children}) =>
  <Form title={title} labelCol={{span: 4}} wrapperCol={{span: 16}} onFinish={onFinish}>
    {children}
  </Form>;

interface SubmitProps {
  buttonText: string;
}

export const DbcrFormSubmit = (props: SubmitProps) => {
  return <Form.Item wrapperCol={{offset: 4, span: 16}}>
    <Button type="primary" htmlType="submit">{props.buttonText}</Button>
  </Form.Item>
};

export default DbcrForm;
