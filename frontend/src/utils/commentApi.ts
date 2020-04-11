import { extractData } from "./apiUtil";
import Comment from "../types/Comment";

export async function postComment(repo_id: string, file_path: string, line_number: number | undefined,
                                  parent_id: string | undefined, comment: string): Promise<Comment> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment, line_number, parent_id })
  };

  const response = await fetch(`/api/v1.0/repos/comment/${repo_id}/${file_path}`, requestOptions);

  return await extractData(response) as Comment;
}

export async function getComments(repo_id: string, file_path: string): Promise<Map<number, Comment[]>> {
  const response = await fetch(`/api/v1.0/repos/view/comments/${repo_id}/${file_path}`);

  let lineNumbersToComments = new Map<number, Comment[]>();
  const commentsByLine = await extractData(response);

  Object.keys(commentsByLine).forEach((key: string) => lineNumbersToComments.set(parseInt(key), commentsByLine[key]));

  return lineNumbersToComments;
}