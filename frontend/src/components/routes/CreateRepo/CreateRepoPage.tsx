import { PageHeader } from "antd";
import React from "react";
import CreateRepo from "./CreateRepo";
import { useRedirector } from "../../../utils/hooks";
import routes from "../../../constants/routes";
import { getUsername } from "../../../utils/authenticationService";

const CreateRepoPage = () => {
  const redirector = useRedirector(() => routes.getHome(getUsername()));

  if (redirector.shouldRedirect) {
    return redirector.element;
  }


  return <>
    <PageHeader title={"Create a New Repository"} onBack={redirector.setRedirect} />
    <CreateRepo />
  </>
};

export default CreateRepoPage;