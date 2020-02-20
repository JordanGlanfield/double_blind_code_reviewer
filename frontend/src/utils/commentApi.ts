import { extractData } from "./apiUtil";
import { LineNumbersToComments } from "../types/Comment"

export async function postComment(repo_id: string, file_path: string, line_number: number | undefined,
                                  parent_id: string | undefined, comment: string): Promise<Comment> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment, line_number, parent_id })
  };

  const response = await fetch(`/api/v1.0/repos/comment/${repo_id}/${file_path}`, requestOptions);

  return <Comment>(await extractData(response))
}

export async function getComments(repo_id: string, file_path: string): Promise<LineNumbersToComments> {
  const response = await fetch(`/api/v1.0/repos/view/comments/${repo_id}/${file_path}`);

  return <LineNumbersToComments>(await extractData(response));
}