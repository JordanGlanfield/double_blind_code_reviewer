import React from "react";

import { Menu } from "antd";

import routes from "../../../constants/routes";
import { hasBeenAuthenticated, getUsername, logout } from "../../../utils/authenticationService";
import { FetchableData } from "../../../utils/hooks";

interface Props {
  isAuthenticatedSource: FetchableData
}

const TopBar = (props: Props) => {
  let isAuthenticatedSource = props.isAuthenticatedSource;

  return <Menu theme="dark" mode="horizontal">
    <Menu.Item>
      <a href={!isAuthenticatedSource.isFetching && !isAuthenticatedSource.data
        ? routes.LOGIN
        : routes.getHome(getUsername())}>Home</a>
    </Menu.Item>
    <Menu.Item>
      {(isAuthenticatedSource.isFetching && hasBeenAuthenticated()) || isAuthenticatedSource.data
        ? <a onClick={logout} href={routes.LOGIN}>Log Out</a>
        : <a href={routes.SIGNUP}>Sign Up</a>}
    </Menu.Item>
  </Menu>
};

export default TopBar;