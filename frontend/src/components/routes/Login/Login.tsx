import React, { useState } from "react"
import { Link, Redirect } from "react-router-dom"
import { getUsername, login, setUserDetails } from "../../../utils/authenticationService"
import routes from "../../../constants/routes"
import { Button, Form, Input, Typography } from "antd";
import styled from "styled-components";

export default (props: any) => {
  const [error, setError] = useState(false);

  if (props.isLoggedIn) {
    return <Redirect to={{pathname: routes.getHome(getUsername())}} />
  }

  const loginPressed = async (values: any) => {
    const success = await login(values.username, values.password)
    if (success) {
      setUserDetails().then(() => {
        props.loggedIn();
      });
    }
    else {
      setError(!success);
    }
  };

  return (
    <FormDiv>
        <OpeningDiv>
          <Typography.Title level={1}>
            DBCR
          </Typography.Title>
          <Typography.Title level={3}>
            A tool for double blind code review
          </Typography.Title>
        </OpeningDiv>
        <Form onFinish={loginPressed}>
          <Form.Item label="Username" name="username" required>
            <Input autoFocus />
          </Form.Item>
          <Form.Item label="Password" name="password" required>
            <Input type="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Log In</Button>
            {error && <ErrorText type="danger">
              Invalid Credentials. Try again.
            </ErrorText>}
          </Form.Item>
        </Form>
        <Link to={routes.SIGNUP}>Not a user? Create an account!</Link>
    </FormDiv>
  )
}

const FormDiv = styled.div`
  max-width: 444px;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
  display: block;
  box-sizing: border-box;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;

const OpeningDiv = styled.div`
  text-align: center;
  border-bottom: 1px solid #cccccc;
  padding-bottom: 5px;
  margin-bottom: 20px;
`;

const ErrorText = styled(Typography.Text)`
  margin-left: 16px;
`;