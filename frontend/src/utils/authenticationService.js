import authConstants from "../constants/auth"
import { extractData } from "./apiUtil";

function storeTokens(username) {
  sessionStorage.setItem(authConstants.USERNAME, username)
}

function removeTokens() {
  sessionStorage.removeItem(authConstants.USERNAME)
}

export async function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  };

  const response = await fetch("/api/login", requestOptions);
  if (response.ok) {
    storeTokens(username);
    return true;
  }
  return false;
}

export async function setUsername() {
  const response = await fetch("/api/userinfo");

  if (!response.ok) {
    return undefined;
  }

  let user = await extractData(response);
  storeTokens(user.username);
  return user.username;
}

export async function logout() {
  removeTokens();
  return fetch("/api/logout", {method: "POST"});
}

export async function isAuthenticated() {
    let response = await fetch("/api/is_authenticated");

    let data = await extractData(response);
    return data.is_authenticated;
}

export function getUsername() {
  let username = sessionStorage.getItem(authConstants.USERNAME);
  return username ? username : "";
}
