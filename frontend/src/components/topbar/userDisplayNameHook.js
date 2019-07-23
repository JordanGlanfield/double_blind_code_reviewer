import {useEffect, useState} from "react";
import performOrRedirect from "../utils/redirection";
import routes from "../../constants/routes";
import authConstants from '../../constants/auth'

export default (history) => {
    const [userDisplayName, setUserDisplayName] = useState('')

    useEffect(() => {
        const requestOptions = {
            headers: {'Authorization': authConstants.ACCESS_TOKEN_HEADER()}
        }

        const fetchUserDetails = async () => {
            return fetch('/api/userinfo', requestOptions)
        }
        fetchUserDetails().then(response =>
            performOrRedirect(
                response,
                (data) => setUserDisplayName(data.firstname),
                () => history.push(routes.LOGIN)
            )
        )
    })
    return [userDisplayName]
}
