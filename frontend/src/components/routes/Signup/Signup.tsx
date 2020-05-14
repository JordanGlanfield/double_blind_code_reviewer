import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { signUp } from "../../../utils/userApi";
import { Redirect } from "react-router-dom";
import routes from "../../../constants/routes";
import { setUsername } from "../../../utils/authenticationService";
import GoBackPageHeader from "../../layout/GoBackPageHeader";

interface Props {
  loggedIn: () => void;
}

const Signup = (props: Props) => {
  const [redirect, setRedirect] = useState(undefined as string | undefined);

  const sendSignUp = (values: any) => {
    signUp(values.username, values.firstName, values.surname, values.password)
      .then(signupResult => {
        if (signupResult.success) {
          setUsername().then(() => {
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
    <GoBackPageHeader title={"Sign up to DBCR"} getUrl={() => routes.LOGIN}/>
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
};

export default Signup;