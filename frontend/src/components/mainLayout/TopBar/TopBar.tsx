import React from "react";
import {useParams} from "react-router-dom";

import { Affix, Button } from "antd";

import routes from "../../../constants/routes";

interface Props {

}

const TopBar = (props: Props) => {
  const {user} = useParams();

  return <Affix offsetTop={0}>
    <Button type={"primary"} href={routes.getHome(user as string)}>Home</Button>
  </Affix>
};

export default TopBar;