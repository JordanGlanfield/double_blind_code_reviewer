import * as React from "react"
import { withRouter, Redirect } from "react-router-dom";
import { useDataSource } from "../../utils/hooks";
import { isAuthenticated } from "../../utils/authenticationService";
import routes from "../../constants/routes";

const AuthCheck = withRouter(({history}) => {
  let isAuthenticatedSource = useDataSource(isAuthenticated);

  console.log(isAuthenticatedSource.data);

  if (isAuthenticatedSource.isFetching || isAuthenticatedSource.data) {
    return <></>
  }

  return <Redirect to={{pathname: routes.LOGIN}} />
});

export default AuthCheck;