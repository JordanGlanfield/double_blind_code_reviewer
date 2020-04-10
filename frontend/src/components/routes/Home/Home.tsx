import * as React from "react"
import useStyles from "./style"
import ViewRepos from "../ViewRepos/ViewRepos";
import { Typography } from "antd";
import NewRepo from "../ViewRepos/NewRepo";
import { useParams } from "react-router-dom";
// import coding from "../../../assets/coding.gif"
// import Grid from "@material-ui/core/Grid/index"

const { Title } = Typography;

// TODO - get username
const Home = () => {
  const {user} = useParams();

  return (
    <div>
      <Title underline level={1}>{user}</Title>

      <Title underline level={2}>Your repos:</Title>
      <Title level={3}>Create Repository:</Title>
      <NewRepo/>
      <Title level={3}>Existing Repositories:</Title>
      <ViewRepos/>

      <Title underline level={2}>Your reviews:</Title>

      <Title underline level={2}>Your reviewer pools</Title>
    </div>
  )
};

export default Home
