import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { isAuthenticated } from '../../utils/authenticationService'
import routes from '../../constants/routes'
import { useDataSource } from "../../utils/hooks";

export default function ProtectedRoute({component: Component, ...rest}) {
    let isAuthenticatedSource = useDataSource(isAuthenticated);

    if (isAuthenticatedSource.isFetching) {
      return <Route />
    }

    if (!isAuthenticatedSource.data) {
      return <Route {...rest} render={props =>
            <Redirect to={{pathname: routes.LOGIN, state: {from: props.location}}}/>
        }
      />
    }

    return <Route {...rest} render={props => <Component {...props} />} />;
}