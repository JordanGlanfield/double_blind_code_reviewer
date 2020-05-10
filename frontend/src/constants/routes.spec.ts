import routes from "./routes";

test("can get a home URI", () => {
  const result = routes.getHome("jason");

  expect(result).toEqual("/jason/home");
});

test ("can get a repo directory", () => {
  const result = routes.getRepoDir("james", "id", "gson", "build/issues");

  expect(result).toEqual("/james/repo/id/gson/build/issues");
});

test("can get base repo directory", () => {
  const result = routes.getRepoDir("james", "id", "gson", "");

  expect(result).toEqual("/james/repo/id/gson")
});

test ("can get a file", () => {
  const result = routes.getRepoFile("james", "id", "gson", "build/issues/errors.txt");

  expect(result).toEqual("/james/repofiles/id/gson/build/issues/errors.txt");
});

test("can get top level file", () => {
  const result = routes.getRepoFile("james", "id", "gson", "README.md");

  expect(result).toEqual("/james/repofiles/id/gson/README.md")
});