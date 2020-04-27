import React, { useEffect } from "react";

import { Menu } from "antd";

import routes from "../../../constants/routes";
import { getUsername, logout } from "../../../utils/authenticationService";
import { FetchableData } from "../../../utils/hooks";

interface Props {
  isLoggedIn: FetchableData
}

const TopBar = (props: Props) => {
  let isLoggedIn = props.isLoggedIn;

  return <Menu theme="dark" mode="horizontal">
    <Menu.Item>
      <a href={!isLoggedIn
        ? routes.LOGIN
        : routes.getHome(getUsername())}>Home</a>
    </Menu.Item>
    <Menu.Item>
      {isLoggedIn
        ? <a onClick={logout} href={routes.LOGIN}>Log Out</a>
        : <a href={routes.SIGNUP}>Sign Up</a>}
    </Menu.Item>
  </Menu>
};

export default TopBar;