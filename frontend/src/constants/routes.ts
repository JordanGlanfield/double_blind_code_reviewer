// Contains constants representing the structures of URI routes as well as functions for constructing URLs
// for routes.

export default {
  LOGIN: "/",
  REFRESH: "/token/refresh",
  NAV: "/:user",
  HOME: "/:user/home",
  REPO_DIRS: "/:user/repo/:repo/",
  REPO_FILES: "/:user/repofiles/:repo",
  TEST: "/test/:item",
  getHome: getHome,
  getRepoDir: getRepoDir,
  getRepoFile: getRepoFile
}

function getHome(user: string) {
  return "/" + user + "/home";
}

function getRepoDir(user: string, repo: string, path: string) {
  let baseUri = "/" + user + "/repo/" + repo;

  if (path !== "") {
    return baseUri + "/" + path;
  }

  return baseUri
}

function getRepoFile(user: string, repo: string, path: string) {
  return "/" + user + "/repofiles/" + repo + "/" + path;
}
