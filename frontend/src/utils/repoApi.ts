import { extractData } from "./apiUtil";

async function get(uriSuffix: string) {
  const uri = "/api/v1.0/repos/view/" + uriSuffix;

  const response = await fetch(uri);

  return extractData(response);
}

export function getDir(repoId: string, path: string) {
  // TODO - safety of using path here?
  return get("dir/" + repoId + "/" + path);
}

export function getFile(repoId: string, path: string) {
  return get("file/" + repoId + "/" + path);
}