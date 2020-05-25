import { Typography } from "antd";
import * as React from "react";
import styled from "styled-components";

interface Props {
  name: string;
  clone_url: string;
}

const ClonePrompt = (props: Props) => {
  let cloneString = "git clone " + props.clone_url + " " + props.name;

  return <ClonableText>
    <Typography.Paragraph copyable>{cloneString}</Typography.Paragraph>
  </ClonableText>
};

const ClonableText = styled.div`
  font-size: 13pt;
  vertical-align: center;
`;

export default ClonePrompt;