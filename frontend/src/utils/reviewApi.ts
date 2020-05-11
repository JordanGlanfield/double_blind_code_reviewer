import reviewSubmissionInfos from "../data/reviewSubmissionInfos.json";
import reviewInfos from "../data/reviewInfos.json";
import { ReviewStats } from "../types/ReviewStats";
import ReviewerPoolSummary from "../types/ReviewerPoolSummary";
import { buildDelete, buildPost, extractData } from "./apiUtil";
import ReviewerPool from "../types/ReviewerPool";

const apiPrefix = "/api/v1.0/reviews/";

// export async function getReviewSubmissionStats(): Promise<ReviewStats[]> {
//   return reviewSubmissionInfos;
// }

export async function getReviewStats(): Promise<ReviewStats[]> {
  const response = await fetch(apiPrefix + "view/reviews");
  let data = await extractData(response);
  console.log(data)
  return data;
}

export async function getReviewerPools(): Promise<ReviewerPoolSummary[]> {
  const response = await fetch(apiPrefix + "view/pools");

  return await extractData(response);
}

export async function getReviewerPool(name: string): Promise<ReviewerPool> {
  const response = await fetch(apiPrefix + "view/pool/" + name);

  return await extractData(response);
}

export async function createReviewerPool(name: string, description: string): Promise<number> {
  const requestOptions = buildPost({name, description});
  const response = await fetch(apiPrefix + "create/pool", requestOptions);

  return await extractData(response);
}

export async function startPoolReviews(pool_name: string, repo_name: string) {
  const requestOptions = buildPost({pool_name, repo_name});
  const response = await fetch(apiPrefix + "start");

  return await extractData(response)
}

export async function addUserToPool(pool_name: string, username: string) {
  const requestOptions = buildPost({pool_name, username});
  const response = await fetch(apiPrefix + "add/pool/user", requestOptions);

  return await extractData(response);
}

export async function removeUserFromPool(pool_name: string, username: string) {
  const response = await fetch(apiPrefix + `delete/pool/${pool_name}/user/${username}`, buildDelete());

  return await extractData(response);
}