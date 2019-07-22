import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import authentication from '../authenticationService'

export default function ProtectedRoute({component: Component, ...rest}) {
    return (
        <Route {...rest} render={props =>
            authentication.userIsLoggedIn()
                ? (<Component {...props} />)
                : (<Redirect to={{
                    pathname: "/login",
                    state: {from: props.location}
                }}/>)
        } />
    )
}