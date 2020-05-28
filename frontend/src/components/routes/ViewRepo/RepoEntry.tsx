import React from "react";
import { Button, Space } from "antd";
import { FileOutlined, FolderFilled, CommentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// Need to show GitLab style view with folders and files. Most important is the name, alphabetic
// display and separation of files and folders.
interface Props {
  name: string;
  hasComments: boolean;
  isDir: boolean;
  href: string;
  onClick: () => void;
  isReviewing: boolean;
}

const RepoEntry = (props: Props) => {
  return <Link to={props.href} onClick={props.onClick}>
    <Space>
      <Button>
        {props.isDir ? <FolderFilled /> : <FileOutlined />}
        {props.name}
      </Button>
      {props.hasComments ? <CommentOutlined /> : <></>}
    </Space>
  </Link>
};

export default RepoEntry;