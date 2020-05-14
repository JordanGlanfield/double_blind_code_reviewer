import React, { useState } from "react";
import { PageHeader } from "antd";
import { Redirect } from "react-router-dom";

interface Props {
  title: string;
  getUrl: () => string;
}

const GoBackPageHeader = (props: Props) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  if (shouldRedirect) {
    return <Redirect to={props.getUrl()} />
  }

  return <PageHeader title={props.title} onBack={() => setShouldRedirect(true)} />
};

export default GoBackPageHeader;