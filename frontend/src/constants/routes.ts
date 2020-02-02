export default {
  LOGIN: "/",
  REFRESH: "/token/refresh",
  HOME: "/:user/home",
  REPO: "/:user/repo/:repo",
  getHome: (user: string) => "/" + user + "/home",
  getRepo: (user: string, repo: string) => "/" + user + "/repo" + repo
}
