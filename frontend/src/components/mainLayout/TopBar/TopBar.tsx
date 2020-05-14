import React from "react";

import { Menu } from "antd";

import routes from "../../../constants/routes";
import { getUsername, logout } from "../../../utils/authenticationService";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface Props {
  isLoggedIn: boolean;
  loggedOut: () => void;
}

const TopBar = (props: Props) => {
  let isLoggedIn = props.isLoggedIn;

  const logOutClicked = () => logout().then(props.loggedOut);

  return <Menu theme="dark" mode="horizontal">
    <Menu.Item>
      <NoHighlightLink to={!isLoggedIn
        ? routes.LOGIN
        : routes.getHome(getUsername())}>Home</NoHighlightLink>
    </Menu.Item>
    <Menu.Item>
      {isLoggedIn
        ? <a onClick={logOutClicked} href={routes.LOGIN}>Log Out</a>
        : <a href={routes.SIGNUP}>Sign Up</a>}
    </Menu.Item>
  </Menu>
};

const NoHighlightLink = styled(Link)`
    text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

export default TopBar;