import * as React from "react"
import useStyles from "./style"
import ViewRepos from "../ViewRepos/ViewRepos";
import { Typography } from "antd";
import NewRepo from "../ViewRepos/NewRepo";
// import coding from "../../../assets/coding.gif"
// import Grid from "@material-ui/core/Grid/index"

const { Title } = Typography;

const Home = () => {
  const classes = useStyles();

  return (
    <div>
      <Title level={2}>Create Repository:</Title>
      <NewRepo/>

      <Title level={2}>Available repositories:</Title>
        
      <ViewRepos/>
    </div>
  )
}

export default Home
