import { Button, Input } from "antd";
import React, { useState } from "react";
import { createRepo } from "../../../utils/repoApi";


const NewRepo = () => {
  const [repoName, setRepoName] = useState("");

  return <>
    <Button
      onClick={() => createRepo(repoName).then(response => window.location.reload())}>
      Create New Repo
    </Button>
    <Input maxLength={64} size={"small"} onChange={(e) => setRepoName(e.target.value)} />
  </>
};

export default NewRepo;