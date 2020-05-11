import React, { useState } from "react"

import { BrowserRouter, Route, Switch } from "react-router-dom"
import Login from "./routes/Login/Login"
import routes from "../constants/routes"
import RepoDir from "./routes/ViewRepo/RepoDir";
import Home from "./routes/Home/Home";
import RepoFile from "./routes/RepoFile/RepoFile";
import TopBar from "./mainLayout/TopBar/TopBar";
import ReviewerPoolDashboard from "./review/ReviewerPoolDashboard";
import Signup from "./routes/Signup/Signup";
import { Layout } from "antd"
import styled from "styled-components";
import { Centered } from "./styles/Centered";
import { checkIsAuthenticated } from "../utils/authenticationService";
import NotFound from "./routes/NotFound/NotFound";
import CreateRepoPage from "./routes/CreateRepo/CreateRepoPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined as undefined | boolean);
  let isLoggedIn: boolean;

  console.log("Authed:", isAuthenticated);

  if (isAuthenticated === undefined) {
    isLoggedIn = false;
    checkIsAuthenticated().then(setIsAuthenticated);
  } else {
    isLoggedIn = isAuthenticated;
  }

  console.log("Logged in: ", isLoggedIn);

  const loggedIn = () => setIsAuthenticated(true);
  const loggedOut = () => setIsAuthenticated(false);

  return (
    <BrowserRouter  forceRefresh={false}>
      <Layout>
        <Layout.Header>
          <TopBar isLoggedIn={isLoggedIn} loggedOut={loggedOut}/>
        </Layout.Header>
        <Layout.Content>
          <ContentDiv>
            <Switch>
              <Route exact path={routes.SIGNUP} render={props => <Signup {...props} loggedIn={loggedIn} />} />
              <Route exact path={routes.LOGIN}
                     render={props =>
                       <Login {...props} isLoggedIn={isLoggedIn} loggedIn={loggedIn} />} />
              {!isLoggedIn && <Route render={props => <div>Not authenticated</div>}/>}
              <Route path={routes.HOME} component={Home} />
              <Route path={routes.REPO_DIRS} component={RepoDir} />
              <Route path={routes.REPO_FILES} component={RepoFile} />
              <Route path={routes.REVIEWER_POOL} component={ReviewerPoolDashboard} />
              <Route path={routes.CREATE_REPO} component={CreateRepoPage} />
              <Route component={NotFound} />
            </Switch>
          </ContentDiv>
        </Layout.Content>
        <Layout.Footer>
          <Empty />
        </Layout.Footer>
      </Layout>
    </BrowserRouter>
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