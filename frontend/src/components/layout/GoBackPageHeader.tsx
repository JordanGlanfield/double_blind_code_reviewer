import React from "react";
import { PageHeader } from "antd";

interface Props {
  title: string;
}

const GoBackPageHeader = (props: Props) => {
  return <PageHeader title={props.title} onBack={() => window.history.back()} />
};

export default GoBackPageHeader;