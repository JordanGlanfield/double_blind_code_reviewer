async function get(uriSuffix: string) {
  const requestOptions = {
    method: "GET"
  };

  const uri = "/api/v1.0/repos/view/" + uriSuffix;

  console.log("GET:" + uri);

  const response = await fetch(uri);

  if (response.ok) {
    return await response.json();
  }

  throw response
}

export function getDir(repoId: string, path: string) {
  // TODO - safety of using path here?
  return get("dir/" + repoId + "/" + path);
}

export function getFile(repoId: string, path: string) {
  return get("file/" + repoId + "/" + path);
}