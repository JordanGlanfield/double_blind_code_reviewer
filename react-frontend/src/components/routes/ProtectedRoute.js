import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import useAuthenticationCheck from "./useAuthenticationCheck";

export default function ProtectedRoute({component: Component, ...rest}) {
    const [authenticated] = useAuthenticationCheck()

    return (
        <Route {...rest} render={props =>
            authenticated
                ? (<Component {...props} />)
                : (<Redirect to={{
                    pathname: "/login",
                    state: {from: props.location}
                }}/>)
        } />
    )
}