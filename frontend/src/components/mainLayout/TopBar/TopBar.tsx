import React from "react";

import { Menu } from "antd";

import routes from "../../../constants/routes";
import { checkHasBeenAuthenticated, getUsername, logout } from "../../../utils/authenticationService";

const TopBar = () => {
  const hasAuthenticated = checkHasBeenAuthenticated();

  return <Menu theme="dark" mode="horizontal">
    <Menu.Item>
      <a href={hasAuthenticated ? routes.getHome(getUsername()) : routes.LOGIN}>Home</a>
    </Menu.Item>
    <Menu.Item>
      {hasAuthenticated
        ? <a onClick={logout} href={routes.LOGIN}>Log Out</a>
        : <a href={routes.SIGNUP}>Sign Up</a>}
    </Menu.Item>
  </Menu>
};

export default TopBar;