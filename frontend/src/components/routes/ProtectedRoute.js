import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import routes from '../../constants/routes'

export default function ProtectedRoute({component: Component, isAuthenticatedSource, ...rest}) {
    return <Route {...rest} render={props => {
      if (!isAuthenticatedSource.isFetching && !isAuthenticatedSource.data) {
        return <Redirect to={{pathname: routes.LOGIN, state: {from: props.location}}}/>;
      }

      return <Component {...props} />
    }} />;
}