import { Button, Input } from "antd";
import React, { useState } from "react";
import { createRepo } from "../../../utils/repoApi";
import styled from "styled-components";


const NewRepo = () => {
  const [repoName, setRepoName] = useState("");

  return <>
    <StyledInput maxLength={64} size={"small"} onChange={(e) => setRepoName(e.target.value)} />
    <Button
      onClick={() => createRepo(repoName).then(response => window.location.reload())}>
      Create New Repo
    </Button>
  </>
};

const StyledInput = styled(Input)`
  display: inline;
  width: 70ch;
  margin-right: 10px;
`;

export default NewRepo;