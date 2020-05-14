// Contains constants representing the structures of URI routes as well as functions for constructing URLs
// for routes.

export default {
  LOGIN: "/login",
  SIGNUP: "/",
  REFRESH: "/token/refresh",
  NAV: "/:user",
  HOME: "/:user/home",
  REPO_DIRS: "/:user/repo/:repoId/:repoName",
  REPO_FILES: "/:user/repofiles/:repoId/:repoName",
  REVIEWER_POOL: "/:user/pool/:pool",
  CREATE_REPO: "/repo/new",
  getHome: getHome,
  getRepoDir: getRepoDir,
  getRepoFile: getRepoFile,
  getReviewerPool: getReviewerPool
}

function getHome(user: string) {
  if (user === "") {
    return "/login";
  }
  return "/" + user + "/home";
}

function getRepoDir(user: string, repoId: string, repoName: string, path: string) {
  let baseUri = "/" + user + "/repo/" + repoId + "/" + repoName;

  if (path !== "") {
    return baseUri + "/" + path;
  }

  return baseUri
}

function getRepoFile(user: string, repoId: string, repoName: string, path: string) {
  return "/" + user + "/repofiles/" + repoId + "/" + repoName + "/" + path;
}

function getReviewerPool(user: string, pool_name: string) {
  return `/${user}/pool/${pool_name}`;
}