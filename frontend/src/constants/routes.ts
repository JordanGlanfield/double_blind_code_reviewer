export default {
  LOGIN: "/",
  REFRESH: "/token/refresh",
  HOME: "/home",
  REPO: "/:user/repo/:repo",
  getRepo: (user, repo) => "/" + user + "/repo" + repo
}
