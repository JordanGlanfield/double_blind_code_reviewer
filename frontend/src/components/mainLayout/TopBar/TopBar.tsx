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
      {!isLoggedIn ? <NoHighlightLink to={routes.LOGIN}>Login</NoHighlightLink>
                   : <NoHighlightLink to={routes.getHome(getUsername())}>Home</NoHighlightLink>}
    </Menu.Item>
    <Menu.Item>
      {isLoggedIn
        ? <NoHighlightLink onClick={logOutClicked} to={routes.LOGIN}>Log Out</NoHighlightLink>
        : <NoHighlightLink to={routes.SIGNUP}>Sign Up</NoHighlightLink>}
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