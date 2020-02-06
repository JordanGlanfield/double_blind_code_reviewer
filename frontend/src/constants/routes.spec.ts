import routes from "./routes";

test("can get a home URI", () => {
  const result = routes.getHome("jason");

  expect(result).toEqual("/jason/home");
});

test ("can get a repo directory", () => {
  const result = routes.getRepoDir("james", "gson", "build/issues");

  expect(result).toEqual("/james/repo/gson/build/issues");
});

test("can get base repo directory", () => {
  const result = routes.getRepoDir("james", "gson", "");

  expect(result).toEqual("/james/repo/gson")
});

test ("can get a file", () => {
  const result = routes.getRepoFile("james", "gson", "build/issues/errors.txt");

  expect(result).toEqual("/james/repofiles/gson/build/issues/errors.txt");
});

test("can get top level file", () => {
  const result = routes.getRepoFile("james", "gson", "README.md");

  expect(result).toEqual("/james/repofiles/gson/README.md")
});