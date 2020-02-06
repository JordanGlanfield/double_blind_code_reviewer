import React from "react";
import { Button, Icon } from "antd";

// Need to show GitLab style view with folders and files. Most important is the name, alphabetic
// display and separation of files and folders.
interface Props {
  name: string,
  isDir: boolean,
  href: string
}

const RepoEntry = (props: Props) => {
  return <Button href={props.href}>
    <Icon type={props.isDir ? "folder" : "file"}
          theme={props.isDir ? "filled" : "outlined"}
    />
    {props.name}
  </Button>
};

export default RepoEntry;