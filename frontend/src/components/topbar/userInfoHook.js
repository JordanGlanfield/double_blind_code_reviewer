import { useEffect, useState } from "react"
import performOrRedirect from "../../utils/redirection"
import routes from "../../constants/routes"
import authConstants from "../../constants/auth"

export default history => {
  const [userFstName, setUserFstName] = useState("")
  const [userLastName, setUserLastName] = useState("")

  useEffect(() => {
    const requestOptions = {
      headers: { Authorization: authConstants.ACCESS_TOKEN_HEADER() }
    }

    const fetchUserDetails = async () => {
      return fetch("/api/userinfo", requestOptions)
    }
    fetchUserDetails().then(response =>
      performOrRedirect(
        response,
        data => {
          setUserFstName(data.firstname)
          setUserLastName(data.lastname)
        },
        () => history.push(routes.LOGIN)
      )
    )
  })
  return {
    userFstName,
    userLastName
  }
}
