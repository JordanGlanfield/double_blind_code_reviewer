import { postComment } from "./commentApi";

test("comment api", () => {
  postComment("gson", "log.txt", undefined, undefined, "the banter is with you");
});