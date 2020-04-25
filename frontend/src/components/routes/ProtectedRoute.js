import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { checkIsAuthenticated } from '../../utils/authenticationService'
import routes from '../../constants/routes'
import { useDataSource } from "../../utils/hooks";

export default function ProtectedRoute({component: Component, ...rest}) {
    let isAuthenticatedSource = useDataSource(checkIsAuthenticated);

    return <Route {...rest} render={props => {
      if (!isAuthenticatedSource.isFetching && !isAuthenticatedSource.data) {
        return <Redirect to={{pathname: routes.LOGIN, state: {from: props.location}}}/>;
      }

      return <Component {...props} />
    }} />;
}