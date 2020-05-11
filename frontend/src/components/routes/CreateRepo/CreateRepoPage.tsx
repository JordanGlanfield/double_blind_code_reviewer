import { PageHeader } from "antd";
import React from "react";
import CreateRepo from "./CreateRepo";

const CreateRepoPage = () => {
  return <>
    <PageHeader title={"Create a New Repository"} onBack={() => window.history.back()} />
    <CreateRepo />
  </>
};

export default CreateRepoPage;