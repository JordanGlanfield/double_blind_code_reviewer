import React from "react";
import { Button, Form, Input, PageHeader, Typography } from "antd";
import { signUp } from "../../../utils/userApi";
import { withRouter } from "react-router-dom";
import routes from "../../../constants/routes";
import styled from "styled-components";
import { CenteredText } from "../../styles/Centered";
import { setUsername } from "../../../utils/authenticationService";

const Signup = withRouter(({history}) => {

  const sendSignUp = (values: any) => {
    signUp(values.username, values.firstName, values.surname, values.password)
      .then(signupResult => {
        if (signupResult.success) {
          setUsername().then(() => history.push(routes.getHome(values.username)));
        } else {
          alert(signupResult.errorMessage);
        }
      });
  };

  return <>
    <PageHeader title={"Sign up to DBCR"} onBack={() => window.history.back()}/>
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
  </>
});

export default Signup;