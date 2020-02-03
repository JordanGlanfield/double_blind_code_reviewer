export default {
  LOGIN: "/",
  REFRESH: "/token/refresh",
  HOME: "/:user/home",
  REPO: "/:user/repo/:repo/",
  TEST: "/test/:item",
  getHome: (user: string) => "/" + user + "/home",
  getRepoDir: (user: string, repo: string) => {
    return "/" + user + "/repo/" + repo;
  },
  getRepoFile: (user: string, repo: string) => {
    return "/" + user + "/repofiles/" + repo;
  }
}
