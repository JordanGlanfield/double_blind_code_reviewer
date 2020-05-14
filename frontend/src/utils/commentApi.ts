import { buildPost, extractData } from "./apiUtil";
import Comment from "../types/Comment";

export async function postComment(review_id: string, file_path: string, line_number: number,
                                  parent_id: string | undefined, contents: string) {
  const requestOptions = buildPost({review_id, file_path, line_number, parent_id, contents});
  const response = await fetch("/api/v1.0/reviews/create/comment", requestOptions);

  return;
}

export async function getComments(review_id: string, file_path: string): Promise<Map<number, Comment[]>> {
  const response = await fetch(`/api/v1.0/reviews/view/comments/${review_id}/${file_path}`);

  let lineNumbersToComments = new Map<number, Comment[]>();
  const commentsByLine = await extractData(response);

  Object.keys(commentsByLine).forEach((key: string) => lineNumbersToComments.set(parseInt(key), commentsByLine[key]));

  return lineNumbersToComments;
}
