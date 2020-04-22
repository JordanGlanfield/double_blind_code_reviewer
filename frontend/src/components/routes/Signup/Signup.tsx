import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { signUp } from "../../../utils/userApi";
import { withRouter } from "react-router-dom";
import routes from "../../../constants/routes";
import BodyDiv from "../../styles/BodyDiv";
import styled from "styled-components";
import { CenteredText } from "../../styles/Centered";

const Signup = withRouter(({history}) => {

  const sendSignUp = (values: any) => {
    signUp(values.username, values.firstName, values.surname, values.password)
      .then(signupResult => {
        if (signupResult.success) {
          history.push(routes.getHome(values.username));
        } else {
          alert(signupResult.errorMessage);
        }
      });
  };

  return <SignupDiv>
    <CenteredText><Typography.Title level={2}>Sign up to DBCR!</Typography.Title></CenteredText>
    <Form labelCol={{span: 4}} wrapperCol={{span: 16}} onFinish={sendSignUp}>
      <Form.Item label="Username"
                 name="username"
                 rules={[{required: true, message: "Enter a username to sign in with"}]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="First Name" name="firstName" rules={[{required: true, message: "Enter your first name"}]}>
        <Input />
      </Form.Item>
      <Form.Item label="Surname" name="surname" rules={[{required: true, message: "Enter your surname"}]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{required: true, message: "Enter a password"}]}>
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{offset: 4, span: 16}}>
        <Button type="primary" htmlType="submit">Sign Up</Button>
      </Form.Item>
    </Form>
  </SignupDiv>
});

const SignupDiv = styled(BodyDiv) `
  margin-top: 20px
`;


export default Signup;