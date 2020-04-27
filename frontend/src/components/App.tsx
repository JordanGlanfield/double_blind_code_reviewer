import React, { useEffect } from "react"

import { ThemeProvider } from "@material-ui/styles"

import { BrowserRouter, Route, RouteProps, Switch } from "react-router-dom"
import Login from "./routes/Login/Login"
import routes from "../constants/routes"
import theme from "../theme"
import RepoDir from "./routes/ViewRepo/RepoDir";
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
import NotFound from "./routes/NotFound/NotFound";

const App = () => {
  const isAuthenticatedSource = useDataSource(checkIsAuthenticated);
  const isLoggedIn = !isAuthenticatedSource.isFetching && isAuthenticatedSource.data;

  // useEffect(() => {console.log("TopBar Mounted Again"); return () => console.log("TopBar unmounted")}, [])

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter forceRefresh={false}>
        <Layout>
          <Layout.Header>
            <TopBar isLoggedIn={isLoggedIn}/>
          </Layout.Header>
          <Layout.Content>
            <ContentDiv>
              <Switch>
                <Route exact path={routes.SIGNUP} component={Signup} />
                <Route exact path={routes.LOGIN}
                       render={props =>
                         <Login {...props} isLoggedIn={isLoggedIn} loggedIn={isAuthenticatedSource.forceRefetch} />} />
                {!isLoggedIn && <Route render={props => <div>Not authenticated</div>}/>}
                <Route path={routes.HOME} component={Home} />
                <Route path={routes.REPO_DIRS} component={RepoDir} />
                <Route path={routes.REPO_FILES} component={RepoFile} />
                <Route path={routes.REVIEWER_POOL} component={ReviewerPoolDashboard} />
                <Route path={routes.CREATE_REPO} component={CreateRepo} />
                <Route component={NotFound} />
              </Switch>
            </ContentDiv>
          </Layout.Content>
          <Layout.Footer>
            <Empty />
          </Layout.Footer>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
};

const Empty = () => {
  return <></>
};

const ContentDiv = styled(Centered)`
  width: 70%;
  max-width: 1080px;
  //background-color: white;
`;

export default App;