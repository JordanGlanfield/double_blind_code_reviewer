import {useEffect, useState} from 'react'

export default () => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(  () => {
        fetch('/authstatus').then(response =>
            response.json().then(authenticationData => {
                const userIsAuthenticated = authenticationData.authenticated
                if (userIsAuthenticated !== authenticated)
                    setAuthenticated(userIsAuthenticated)
            })
        )
    })

    return [authenticated]
}