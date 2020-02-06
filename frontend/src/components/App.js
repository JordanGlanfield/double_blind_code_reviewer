import React from "react"
import { Switch, Route, BrowserRouter } from "react-router-dom"
import Login from "./routes/login/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import routes from "../constants/routes"
import theme from "../theme"
import { ThemeProvider } from "@material-ui/styles"
import RepoDir from "./routes/repo_dir/RepoDir";
import Home from "./routes/home/Home";
import RepoFile from "./routes/repo_file/RepoFile";
import TopBar from "./mainLayout/TopBar/TopBar";

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.LOGIN} component={Login} />
          <Route>
            <ProtectedRoute path="/" component={TopBar} />
            <Switch>
              <ProtectedRoute path={routes.HOME} component={Home} />
              <ProtectedRoute path={routes.REPO_DIRS} component={RepoDir} />
              <ProtectedRoute path={routes.REPO_FILES} component={RepoFile} />
            </Switch>
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}
