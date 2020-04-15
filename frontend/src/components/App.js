import React from "react"

import { ThemeProvider } from "@material-ui/styles"

import { Switch, Route, BrowserRouter } from "react-router-dom"
import Login from "./routes/Login/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import routes from "../constants/routes"
import theme from "../theme"
import RepoDir from "./routes/RepoDir/RepoDir";
import Home from "./routes/Home/Home";
import RepoFile from "./routes/RepoFile/RepoFile";
import TopBar from "./mainLayout/TopBar/TopBar";
import ReviewerPoolDashboard from "./review/ReviewerPoolDashboard";

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.LOGIN} component={Login} />
          <Route>
            <ProtectedRoute path={routes.NAV} component={TopBar} />
            <Switch>
              <ProtectedRoute path={routes.HOME} component={Home} />
              <ProtectedRoute path={routes.REPO_DIRS} component={RepoDir} />
              <ProtectedRoute path={routes.REPO_FILES} component={RepoFile} />
              <ProtectedRoute path={routes.REVIEWER_POOL} component={ReviewerPoolDashboard} />
            </Switch>
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}
