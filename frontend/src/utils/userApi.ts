import { buildPost } from "./apiUtil";

export interface SignupResult {
  success: boolean,
  errorMessage: string
}

export async function signUp(username: string, first_name: string, surname: string, password: string):
  Promise<SignupResult> {
  const requestOptions = buildPost({username, first_name, surname, password});
  const response = await fetch("/api/signup", requestOptions);

  if (!response.ok) {
    return {success: false, errorMessage: await response.text()};
  }
  return {success: true, errorMessage: ""};
}