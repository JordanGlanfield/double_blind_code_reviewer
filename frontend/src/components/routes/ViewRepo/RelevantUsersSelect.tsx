import { useDataSource } from "../../../utils/hooks";
import { getRelatedUsers } from "../../../utils/reviewApi";
import User from "../../../types/User";
import { Select } from "antd";
import React from "react";

const RelevantUsersSelect = () => {
  const relatedUsersSource = useDataSource(getRelatedUsers);

  return <Select>
    {relatedUsersSource.data && relatedUsersSource.data.map((user: User) =>
      <Select.Option key={user.username} value={user.username}>{user.username}</Select.Option>)}
  </Select>
};

export default RelevantUsersSelect;