import React from "react"

import { ThemeProvider } from "@material-ui/styles"

import { BrowserRouter, Route, RouteProps, Switch } from "react-router-dom"
import Login from "./routes/Login/Login"
import ProtectedArea from "./routes/ProtectedArea"
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
import { FetchableData, useDataSource } from "../utils/hooks";

const App = () => {
  const isAuthenticatedSource = useDataSource(checkIsAuthenticated);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <DefaultPageRoute path={routes.SIGNUP} isAuthenticatedSource={isAuthenticatedSource} content={Signup} />
          <DefaultPageRoute path={routes.LOGIN} isAuthenticatedSource={isAuthenticatedSource} content={Login} />
          <ProtectedArea isAuthenticatedSource={isAuthenticatedSource}>
            <DefaultPageRoute path={routes.HOME} isAuthenticatedSource={isAuthenticatedSource} content={Home} />
            <DefaultPageRoute path={routes.REPO_DIRS} isAuthenticatedSource={isAuthenticatedSource} content={RepoDir} />
            <DefaultPageRoute path={routes.REPO_FILES}
                              isAuthenticatedSource={isAuthenticatedSource}
                              content={RepoFile} />
            <DefaultPageRoute path={routes.REVIEWER_POOL}
                              isAuthenticatedSource={isAuthenticatedSource}
                              content={ReviewerPoolDashboard} />
            <DefaultPageRoute path={routes.CREATE_REPO}
                              isAuthenticatedSource={isAuthenticatedSource}
                              content={CreateRepo} />
          </ProtectedArea>
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
  path: string;
  isAuthenticatedSource: FetchableData;
  content: (props: any) => JSX.Element;
  contentProps?: any;
  children?: any;
}

const DefaultPageRoute = ({path, isAuthenticatedSource, content: Content, contentProps, children, ...rest}: DefaultPageRouteProps) => {
  return <PageRoute
    exact
    path={path}
    header={TopBar}
    headerProps={{isAuthenticatedSource: isAuthenticatedSource}}
    content={Content}
    contentProps={contentProps}
    footer={EmptyFooter}>
    {children}
  </PageRoute>;
};

interface PageRouteProps {
  header: (props: any) => JSX.Element;
  headerProps?: any;
  content: (props: any) => JSX.Element;
  contentProps?: any;
  footer: (props: any) => JSX.Element;
  footerProps?: any;
  children?: any;
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

const EmptyFooter = () => {
  return <></>
};

const ContentDiv = styled(Centered)`
  width: 70%;
  max-width: 1080px;
  //background-color: white;
`;

export default App;