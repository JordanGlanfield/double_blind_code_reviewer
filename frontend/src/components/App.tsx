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

  useEffect(() => {console.log("TopBar Mounted Again"); return () => console.log("TopBar unmounted")}, [])

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <DefaultPageRoute exact
                            path={routes.SIGNUP}
                            isLoggedIn={isLoggedIn}
                            content={Signup}
                            contentProps={{loggedIn: isAuthenticatedSource.forceRefetch}}/>
          <DefaultPageRoute exact
                            path={routes.LOGIN}
                            isLoggedIn={isLoggedIn}
                            content={Login}
                            contentProps={{loggedIn: isAuthenticatedSource.forceRefetch}} />
          {!isLoggedIn && <DefaultPageRoute isLoggedIn={false} content={Empty} />}
          <DefaultPageRoute path={routes.HOME} isLoggedIn={isLoggedIn} content={Home} />
          <DefaultPageRoute path={routes.REPO_DIRS} isLoggedIn={isLoggedIn} content={RepoDir} />
          <DefaultPageRoute path={routes.REPO_FILES}
                            isLoggedIn={isLoggedIn}
                            content={RepoFile} />
          <DefaultPageRoute path={routes.REVIEWER_POOL}
                            isLoggedIn={isLoggedIn}
                            content={ReviewerPoolDashboard} />
          <DefaultPageRoute path={routes.CREATE_REPO}
                            isLoggedIn={isLoggedIn}
                            content={CreateRepo} />
          <DefaultPageRoute isLoggedIn={isLoggedIn} content={NotFound} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
};

interface RouteWrapperProps {
  component: (props: any) => JSX.Element;
  layout: (props: any) => JSX.Element;
}

const RouteWrapper = ({component: Component, layout: Layout, ...rest}: RouteWrapperProps) => {
  return <Route {...rest} render={props =>
    <Layout {...props}>
      <Component {...props} />
    </Layout>
  }/>
};

interface DefaultPageRouteProps {
  isLoggedIn: boolean;
  content: (props: any) => JSX.Element;
  contentProps?: any;
}

const DefaultPageRoute = ({path, isLoggedIn, content: Content, contentProps, ...rest}
    : DefaultPageRouteProps & RouteProps) => {
  return <PageRoute
    {...rest}
    header={TopBar}
    headerProps={{isLoggedIn: isLoggedIn}}
    content={Content}
    contentProps={contentProps}
    footer={Empty}
  />
};

interface PageRouteProps {
  header: (props: any) => JSX.Element;
  headerProps?: any;
  content: (props: any) => JSX.Element;
  contentProps?: any;
  footer: (props: any) => JSX.Element;
  footerProps?: any;
}

const PageRoute = ({header: Header, headerProps, content: Content, contentProps, footer: Footer, footerProps, ...rest}
    : PageRouteProps & RouteProps) => {
  return <Route {...rest} render={props =>
    <Layout>
      <Layout.Header>
        <Header {...props} {...headerProps} />
      </Layout.Header>
      <Layout.Content>
        <Content {...props} {...contentProps} />
      </Layout.Content>
      <Layout.Footer>
        <Footer {...props} {...footerProps} />
      </Layout.Footer>
    </Layout>
  }/>
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