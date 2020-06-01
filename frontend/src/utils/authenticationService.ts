import authConstants from "../constants/auth"
import { extractData } from "./apiUtil";

function storeTokens(username: string, is_admin: boolean) {
  sessionStorage.setItem(authConstants.USERNAME, username);
  sessionStorage.setItem(authConstants.IS_ADMIN, is_admin ? "1" : "");
}

function removeTokens() {
  sessionStorage.removeItem(authConstants.USERNAME);
  sessionStorage.removeItem(authConstants.IS_ADMIN);
}

export async function login(username: string, password: string) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  };

  const response = await fetch("/api/login", requestOptions);
  const data = await extractData(response);

  if (response.ok) {
    storeTokens(username, data.is_admin);
    return true;
  }
  return false;
}

export async function setUserDetails() {
  let response = await fetch("/api/userinfo");

  if (!response.ok) {
    removeTokens();
    return undefined;
  }

  let user = await extractData(response);
  storeTokens(user.username, user.is_admin);
  return user.username;
}

export async function logout() {
  removeTokens();
  return fetch("/api/logout", {method: "POST"});
}

export async function checkIsAuthenticated() {
  let usernamePromise = setUserDetails();
  let response = await fetch("/api/is_authenticated");
  await usernamePromise;

  let data = await extractData(response);

  return data.is_authenticated;
}

export function hasBeenAuthenticated() {
  return getUsername() !== "";
}

export function getUsername(): string {
  let username = sessionStorage.getItem(authConstants.USERNAME);
  return username ? username : "";
}

export function hasAdminPrivileges(): boolean {
  let isAdmin = sessionStorage.getItem(authConstants.IS_ADMIN);
  return isAdmin === "1";
}
