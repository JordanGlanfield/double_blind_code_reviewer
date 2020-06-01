import React, { useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { signUp } from "../../../utils/userApi";
import { Link, Redirect } from "react-router-dom";
import routes from "../../../constants/routes";
import { setUserDetails } from "../../../utils/authenticationService";
import styled from "styled-components";

interface Props {
  loggedIn: () => void;
}

const Signup = (props: Props) => {
  const [redirect, setRedirect] = useState(undefined as string | undefined);

  const sendSignUp = (values: any) => {
    signUp(values.username, values.firstName, values.surname, values.password)
      .then(signupResult => {
        if (signupResult.success) {
          setUserDetails().then(() => {
            props.loggedIn();
            setRedirect(routes.getHome(values.username))
          });
        } else {
          alert(signupResult.errorMessage);
        }
      });
  };

  if (redirect) {
    return <Redirect to={redirect} />
  }

  return <>
    <TitleDiv>
      <Typography.Title level={1}>DBCR</Typography.Title>
    </TitleDiv>
    <DbcrDiv>
      <Typography.Paragraph>
        Hey there! Welcome to the <strong>Double Blind Code Review</strong> tool! This tool allows you to upload your code
        via <strong>Git</strong> and request others to review it. However, during the review process, you won't know the identity of your
        reviewers, and they won't know your identity.

      </Typography.Paragraph>
      <Typography.Paragraph>
        This is part of an experiment to investigate anonymisation in code review:
        <ul>
          <li>Can we reduce subconscious biases present in the review process?</li>
          <li>What effects does anonymisation have on review quality?</li>
          <li>Why does such a tool not exist already, is double blind code review feasible in practice?</li>
        </ul>
      </Typography.Paragraph>
      <Typography.Paragraph>
        To help out, sign up below!
      </Typography.Paragraph>
    </DbcrDiv>
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
    <Link to={routes.LOGIN}>Already a user? Sign in!</Link>
  </>
};

const TitleDiv = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const DbcrDiv = styled.div`
  font-size: 12pt;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #cccccc;
`;

export default Signup;