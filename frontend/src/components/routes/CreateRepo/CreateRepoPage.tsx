import React from "react";
import CreateRepo from "./CreateRepo";
import routes from "../../../constants/routes";
import { getUsername } from "../../../utils/authenticationService";
import GoBackPageHeader from "../../layout/GoBackPageHeader";

const CreateRepoPage = () => {
  return <>
    <GoBackPageHeader title={"Create a New Repository"} getUrl={() => routes.getHome(getUsername())} />
    <CreateRepo />
  </>
};

export default CreateRepoPage;