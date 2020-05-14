import React, { useState } from "react"
import { Button, Form, Input } from "antd";
import { createRepo } from "../../../utils/repoApi";
import { Redirect } from "react-router-dom";
import routes from "../../../constants/routes";
import { getUsername } from "../../../utils/authenticationService";
import Repo from "../../../types/Repo";

interface Props {
  shouldRedirect?: boolean;
  creationApi?: (repoName: string) => Promise<any>;
}

const CreateRepo = (props: Props) => {
  const [newRepo, setNewRepo] = useState(undefined as undefined | Repo);

  const shouldRedirect = props.shouldRedirect === undefined ? true : props.shouldRedirect;
  const creationApi = props.creationApi ? props.creationApi : createRepo;

  const createNewRepo = (values: any) => {
    let repoName = values.name;
    creationApi(repoName)
      .then(repo => {
        if (shouldRedirect) {
          setNewRepo(repo)
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to create repo");
      });
  };

  if (newRepo && shouldRedirect) {
    return <Redirect to={routes.getRepoDir(getUsername(), undefined, newRepo.id, newRepo.name, "")} />
  }

  return <>
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