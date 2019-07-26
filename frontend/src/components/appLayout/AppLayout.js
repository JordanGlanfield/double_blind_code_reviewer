import React from "react"
import TopBar from "../topbar/TopBar.js"
import Sidebar from "../sidebar/Sidebar.js"
import useResponsiveSidebar from "../sidebar/responsiveSidebarHook.js"
import { CssBaseline } from "@material-ui/core/index"
import authenticationService from "../../utils/authenticationService"
import routes from "../../constants/routes"
import { BrowserRouter, Route } from "react-router-dom"
import Home from "../home/Home"
import useUserInformation from "../topbar/userInfoHook"

const AppLayout = props => {
  const sidebarHandle = useResponsiveSidebar()
  const userInfo = useUserInformation(props.history)

  const logout = event => {
    event.preventDefault()
    authenticationService.logout()
    props.history.push(routes.LOGIN)
  }

  return (
    <BrowserRouter>
      <div>
        <CssBaseline />
        <TopBar
          onLogoutAction={logout}
          toggleSidebar={sidebarHandle.toggleSidebar}
        />
        <Sidebar useResponsiveSidebar={sidebarHandle} userInfo={userInfo} />
        <Route
          exact
          path={routes.HOME}
          render={routeProps => <Home {...routeProps} />}
        />
      </div>
    </BrowserRouter>
  )
}
export default AppLayout
