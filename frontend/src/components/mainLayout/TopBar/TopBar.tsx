import React from "react";
import {useParams} from "react-router-dom";

import { Affix, Button } from "antd";

import routes from "../../../constants/routes";
import { logout } from "../../../utils/authenticationService";

interface Props {

}

const TopBar = (props: Props) => {
  const {user} = useParams();

  return <Affix offsetTop={0}>
    <div>
      <Button type={"primary"} href={routes.getHome(user as string)}>Home</Button>
      <Button type={"primary"} onClick={logout} href={routes.LOGIN}>Log Out</Button>
    </div>
  </Affix>
};

export default TopBar;