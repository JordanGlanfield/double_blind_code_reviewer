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
import { Layout } from "antd"
import styled from "styled-components";
import { Centered } from "./styles/Centered";
import CreateRepo from "./routes/CreateRepo/CreateRepo";
import { checkIsAuthenticated } from "../utils/authenticationService";
import { useDataSource } from "../utils/hooks";

const App = () => {
  const isAuthenticatedSource = useDataSource(checkIsAuthenticated);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Layout>
          <Layout.Header>
            <TopBar isAuthenticatedSource={isAuthenticatedSource} />
          </Layout.Header>
          <Layout.Content>
            <ContentDiv>
              <Switch>
                <Route exact path={routes.SIGNUP} component={Signup} />
                <Route exact path={routes.LOGIN} component={Login} />
                <ProtectedRoute isAuthenticatedSource={isAuthenticatedSource} component={PageRoutes} />
              </Switch>
            </ContentDiv>
          </Layout.Content>
          <Layout.Footer />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
};

const PageRoutes = () => {
  return <Switch>
    <Route path={routes.HOME} component={Home} />
    <Route path={routes.REPO_DIRS} component={RepoDir} />
    <Route path={routes.REPO_FILES} component={RepoFile} />
    <Route path={routes.REVIEWER_POOL} component={ReviewerPoolDashboard} />
    <Route path={routes.CREATE_REPO} component={CreateRepo} />
  </Switch>
};

const ContentDiv = styled(Centered)`
  width: 70%;
  max-width: 1080px;
  //background-color: white;
`;

export default App;