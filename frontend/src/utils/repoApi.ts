async function get(uriSuffix: string) {
  const requestOptions = {
    method: "GET"
  };

  const response = await fetch("/api/v1.0/repos/view/dir" + uriSuffix);

  if (response.ok) {
    return await response.json();
  }

  throw response
}

export function getFile(repoId: string, path: string) {
  // TODO - safety of using path here?
  return get("/" + repoId + "/" + path)
}