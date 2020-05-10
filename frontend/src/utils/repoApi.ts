import { extractData } from "./apiUtil";
import Repo from "../types/Repo";

async function get(uriSuffix: string) {
  const uri = "/api/v1.0/repos/view/" + uriSuffix;

  const response = await fetch(uri);

  return extractData(response);
}

export function getRepos(): Promise<Repo[]> {
  return get("all");
}

export function getDir(repoId: string, path: string) {
  // TODO - safety of using path here?
  return get("dir/" + repoId + "/" + path);
}

export async function getFile(repoId: string, path: string) {
  return get("file/" + repoId + "/" + path);
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