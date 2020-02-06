import { extractPath, getNextDirUp } from "./routeUtil";

const fullPath = "logan/repo/gson/build/issues";
const prefix = "logan/repo/gson/";

test("can extract a path", () => {
  const result = extractPath(prefix, fullPath);

  expect(result).toEqual("build/issues")
});

test("extracting an empty path gives empty string", () => {
  const result = extractPath(prefix, prefix);

  expect(result).toEqual("");
});

test("can get the next directory up", () => {
  const currentDir = "topLevel/secondLevel/thirdLevel";

  const result = getNextDirUp(currentDir);

  expect(result).toEqual("topLevel/secondLevel");
});

test("can get containing directory of file", () => {
  const file = "topLevel/secondLevel/thirdLevel/testing.txt";

  const result = getNextDirUp(file);

  expect(result).toEqual("topLevel/secondLevel/thirdLevel")
});

test("next directory up from nothing is nothing", () => {
  const result = getNextDirUp("");

  expect(result).toEqual("");
});