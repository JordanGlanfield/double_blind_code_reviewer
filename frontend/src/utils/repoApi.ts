import { buildPost, extractData } from "./apiUtil";
import Repo from "../types/Repo";

async function get(uriSuffix: string, requestOptions: any=undefined) {
  const uri = "/api/v1.0/repos/view/" + uriSuffix;

  const response = await fetch(uri, requestOptions);

  return extractData(response);
}

export function getRepos(): Promise<Repo[]> {
  return get("all");
}

export function getDir(repoId: string, path = "", review_id= "") {
  review_id = review_id ? review_id : "None";
  // TODO - safety of using path here?
  return get("dir/" + repoId + "/" + review_id + "/" + path);
}

export async function getFile(repoId: string, path: string) {
  let requestOptions = {
    headers: {
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    }
  };

  return get("file/" + repoId + "/" + path, requestOptions);
}

export async function createRepo(repo_name: string): Promise<Repo> {
  const uri = "/api/v1.0/repos/create";

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_name })
  };

  let response = await fetch(uri, requestOptions);

  return extractData(response);
}

export async function createRepoForPool(repo_name: string, pool_name: string) {
  const uri = "/api/v1.0/repos/pool_create";
  const requestOptions = buildPost({repo_name, pool_name});
  const response = await fetch(uri, requestOptions);

  const failed_usernames: string[] = await extractData(response);

  if (failed_usernames.length > 0) {
    console.log("Repo creation failed for some users", failed_usernames)
  }
}