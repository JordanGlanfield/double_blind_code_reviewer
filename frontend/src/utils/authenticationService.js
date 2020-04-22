import authConstants from "../constants/auth"
import { extractData } from "./apiUtil";

function storeTokens(username, access_token) {
  sessionStorage.setItem(authConstants.USERNAME, username)
  sessionStorage.setItem(authConstants.ACCESS_TOKEN, access_token)
  // sessionStorage.setItem(authConstants.REFRESH_TOKEN, refresh_token)
}

function removeTokens() {
  sessionStorage.removeItem(authConstants.USERNAME)
  sessionStorage.removeItem(authConstants.ACCESS_TOKEN)
  // sessionStorage.removeItem(authConstants.REFRESH_TOKEN)
}

async function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  }

  const response = await fetch("/api/login", requestOptions)
  if (response.ok) {
    console.log(response)
    const data = await response.json()
    storeTokens(username, data)
    return true
  }
  return false
}

const logout = () => removeTokens()
const userIsLoggedIn = () => {
  return sessionStorage.getItem(authConstants.ACCESS_TOKEN) !== null
}

export async function isAuthenticated() {
    let response = await fetch("/api/is_authenticated");

    let data = await extractData(response);
    return data.is_authenticated;
}

export const getUsername = () => {
  return sessionStorage.getItem(authConstants.USERNAME);
}

export default {
  login,
  logout,
  userIsLoggedIn
}
