import { extractPath } from "./routeUtil";

const fullPath = "logan/repo/gson/build/issues";
const prefix = "logan/repo/gson/";

test('can extract a path', () => {
  const result = extractPath(prefix, fullPath);

  expect(result).toEqual("build/issues")
});

test('extracting an empty path gives empty string', () => {
  const result = extractPath(prefix, prefix);

  expect(result).toEqual("");
});