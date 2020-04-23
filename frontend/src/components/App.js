import React from "react"

import { ThemeProvider } from "@material-ui/styles"

import { BrowserRouter, Route, Switch } from "react-router-dom"
import Login from "./routes/Login/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import routes from "../constants/routes"
import theme from "../theme"
import RepoDir from "./routes/RepoDir/RepoDir";
import Home from "./routes/Home/Home";
import RepoFile from "./routes/RepoFile/RepoFile";
import TopBar from "./mainLayout/TopBar/TopBar";
import ReviewerPoolDashboard from "./review/ReviewerPoolDashboard";
import Signup from "./routes/Signup/Signup";

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.SIGNUP} component={Signup} />
          <Route exact path={routes.LOGIN} component={Login} />
          <ProtectedRoute>
            <Route path={routes.NAV} component={TopBar} />
            <Switch>
              <Route path={routes.HOME} component={Home} />
              <Route path={routes.REPO_DIRS} component={RepoDir} />
              <Route path={routes.REPO_FILES} component={RepoFile} />
              <Route path={routes.REVIEWER_POOL} component={ReviewerPoolDashboard} />
            </Switch>
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}
