import React, { useState } from "react"
import { Button, Form, Input, PageHeader } from "antd";
import { createRepo } from "../../../utils/repoApi";
import { Redirect } from "react-router-dom";
import routes from "../../../constants/routes";
import { getUsername } from "../../../utils/authenticationService";

const CreateRepo = () => {
  const [newRepoName, setNewRepoName] = useState(undefined as undefined | string);

  const newRepo = (values: any) => {
    let repoName = values.name;
    createRepo(repoName)
      .then(() => setNewRepoName(repoName))
      .catch((error) => {
        console.log(error);
        alert("Failed to create repo");
      });
  };

  if (newRepoName) {
    return <Redirect to={routes.getRepoDir(getUsername(), newRepoName, "")} />
  }

  return <>
    <PageHeader title={"Create a New Repository"} onBack={() => window.history.back()} />
    <Form labelCol={{span: 4}} wrapperCol={{span: 16}} onFinish={newRepo}>
      <Form.Item label="Repository Name"
                 name="name"
                 rules={[{required: true, message: "Enter a name for the repository"}]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{offset: 4, span: 16}}>
        <Button type="primary" htmlType="submit">Create</Button>
      </Form.Item>
    </Form>
  </>
};

export default CreateRepo;