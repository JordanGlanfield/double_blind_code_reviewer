import React from "react";
import { Button } from "antd";
import { FileOutlined, FolderFilled } from "@ant-design/icons/lib";
import { Link } from "react-router-dom";

// Need to show GitLab style view with folders and files. Most important is the name, alphabetic
// display and separation of files and folders.
interface Props {
  name: string;
  isDir: boolean;
  href: string;
  onClick: () => void;
  isReviewing: boolean;
}

const RepoEntry = (props: Props) => {
  console.log(props.href)
  return <Link to={props.href} onClick={props.onClick}>
    <Button>
      {props.isDir ? <FolderFilled /> : <FileOutlined />}
      {props.name}
    </Button>
  </Link>
};

export default RepoEntry;