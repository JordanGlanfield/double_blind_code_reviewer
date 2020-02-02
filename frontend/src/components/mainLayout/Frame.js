import React from "react"
import TopBar from "./topbar/TopBar.js"
import Sidebar from "./sidebar/Sidebar.js"
import useResponsiveSidebar from "./sidebar/responsiveSidebarHook.js"
import { Container, CssBaseline } from "@material-ui/core/index"
import authenticationService from "../../utils/authenticationService"
import routes from "../../constants/routes"
import { BrowserRouter, Route, useParams } from "react-router-dom"
import Home from "../routes/home/Home"
import useUserInformation from "./topbar/userInfoHook"
import useStyles from "./style"

const Frame = props => {
  const sidebarHandle = useResponsiveSidebar()
  const userInfo = useUserInformation(props.history)
  const classes = useStyles()

  const logout = event => {
    event.preventDefault()
    authenticationService.logout()
    props.history.push(routes.LOGIN)
  }

  console.log(props);

  return (
    <BrowserRouter>
      <div>
        <CssBaseline />
        <TopBar
          onLogoutAction={logout}
          toggleSidebar={sidebarHandle.toggleSidebar}
        />
        <Sidebar useResponsiveSidebar={sidebarHandle} userInfo={userInfo} />
        <div className={classes.main}>
          <Container className={classes.container}>
            <Route
              path={routes.getHome(props.user)}
              render={routeProps => <Home {...routeProps} />}
            />
          </Container>
        </div>
      </div>
    </BrowserRouter>
  )
}
export default Frame
