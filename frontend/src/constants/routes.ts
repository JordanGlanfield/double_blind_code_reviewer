// Contains constants representing the structures of URL routes as well as functions for constructing URLs
// for routes.

export default {
  LOGIN: "/",
  REFRESH: "/token/refresh",
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
  return "/" + user + "/repo/" + repo + "/" + path;
}

function getRepoFile(user: string, repo: string, path: string) {
  return "/" + user + "/repofiles/" + repo + "/" + path;
}
