import { extractData } from "./apiUtil";

async function get(uriSuffix: string) {
  const uri = "/api/v1.0/repos/view/" + uriSuffix;

  const response = await fetch(uri);

  return extractData(response);
}

export function getRepos() {
  return get("all");
}

export function getDir(repoId: string, path: string) {
  // TODO - safety of using path here?
  return get("dir/" + repoId + "/" + path);
}

export async function getFile(repoId: string, path: string) {
  return extractData(await fetch("/static/" + repoId + "/" + path));
}

export async function createRepo(repo_name: string) {
  const uri = "/api/v1.0/repos/create";

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_name })
  };

  return fetch(uri, requestOptions);
}