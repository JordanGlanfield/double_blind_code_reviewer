import React from "react";
import { Button } from "antd";
import { FileOutlined, FolderFilled } from "@ant-design/icons/lib";

// Need to show GitLab style view with folders and files. Most important is the name, alphabetic
// display and separation of files and folders.
interface Props {
  name: string,
  isDir: boolean,
  href: string
}

const RepoEntry = (props: Props) => {
  return <Button href={props.href}>
    {props.isDir ? <FolderFilled /> : <FileOutlined />}
    {props.name}
  </Button>
};

export default RepoEntry;