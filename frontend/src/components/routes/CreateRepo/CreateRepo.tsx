import React, { useState } from "react"
import { Button, Form, Input, PageHeader } from "antd";
import { createRepo } from "../../../utils/repoApi";
import { Redirect } from "react-router-dom";
import routes from "../../../constants/routes";
import { getUsername } from "../../../utils/authenticationService";
import Repo from "../../../types/Repo";

const CreateRepo = () => {
  const [newRepo, setNewRepo] = useState(undefined as undefined | Repo);

  const createNewRepo = (values: any) => {
    let repoName = values.name;
    createRepo(repoName)
      .then(repo => setNewRepo(repo))
      .catch((error) => {
        console.log(error);
        alert("Failed to create repo");
      });
  };

  if (newRepo) {
    return <Redirect to={routes.getRepoDir(getUsername(), newRepo.id, newRepo.name, "")} />
  }

  return <>
    <PageHeader title={"Create a New Repository"} onBack={() => window.history.back()} />
    <Form labelCol={{span: 4}} wrapperCol={{span: 16}} onFinish={createNewRepo}>
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