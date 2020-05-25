import React, { FunctionComponent } from "react";
import { Button, Form } from "antd";

interface Props {
  labelSpan?: number;
  wrapperColSpan?: number;
  layout?: "vertical" | "horizontal" | "inline";
  title: string;
  onFinish: (values: any) => void;
}

const DbcrForm: FunctionComponent<Props> = ({labelSpan, wrapperColSpan, layout, title, onFinish, children}) =>
  <Form title={title} labelCol={{span: labelSpan ? labelSpan : 4}}
        wrapperCol={{span: wrapperColSpan ? wrapperColSpan : 16}}
        layout={layout ? layout : "horizontal"}
        onFinish={onFinish}>
    {children}
  </Form>;

interface SubmitProps {
  labelSpan?: number;
  wrapperColSpan?: number;
  buttonText: string;
}

export const DbcrFormSubmit = (props: SubmitProps) => {
  return <Form.Item wrapperCol={{offset: props.labelSpan ? props.labelSpan : 4,
    span: props.wrapperColSpan ? props.wrapperColSpan : 16}}>
    <Button type="primary" htmlType="submit">{props.buttonText}</Button>
  </Form.Item>
};

export default DbcrForm;
