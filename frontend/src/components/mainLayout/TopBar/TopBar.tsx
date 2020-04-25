import React from "react";

import { Affix, Button, Menu } from "antd";

import routes from "../../../constants/routes";
import { getUsername, logout } from "../../../utils/authenticationService";

const TopBar = () => {
  return <Menu theme="dark" mode="horizontal">
    <Menu.Item>
      <a href={routes.getHome(getUsername())}>Home</a>
    </Menu.Item>
    <Menu.Item>
      <a onClick={logout} href={routes.LOGIN}>Log Out</a>
    </Menu.Item>
  </Menu>
};

export default TopBar;