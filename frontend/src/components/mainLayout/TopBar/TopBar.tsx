import React from "react";

import { Affix, Button } from "antd";

import routes from "../../../constants/routes";
import { getUsername, logout } from "../../../utils/authenticationService";

const TopBar = () => {
  return <Affix offsetTop={0}>
    <div>
      <Button type={"primary"} href={routes.getHome(getUsername())}>Home</Button>
      <Button type={"primary"} onClick={logout} href={routes.LOGIN}>Log Out</Button>
    </div>
  </Affix>
};

export default TopBar;