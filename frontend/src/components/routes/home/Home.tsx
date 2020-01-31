import * as React from "react"
import useStyles from "./style"
import ViewRepos from "../view_repos/ViewRepos";
// import coding from "../../../assets/coding.gif"
// import Grid from "@material-ui/core/Grid/index"

const Home = () => {
  const classes = useStyles()

  return (
    <div>
      Testing
      <ViewRepos data={["gson", "banter_repo", "linux_kernel"]}/>
    </div>
  )
}

export default Home
