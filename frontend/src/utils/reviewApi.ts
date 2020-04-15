import reviewSubmissionInfos from "../data/reviewSubmissionInfos.json";
import reviewInfos from "../data/reviewInfos.json";
import { ReviewStats } from "../types/ReviewStats";
import ReviewerPoolSummary from "../types/ReviewerPoolSummary";
import { buildPost, extractData } from "./apiUtil";
import ReviewerPool from "../types/ReviewerPool";

const apiPrefix = "/api/v1.0/reviews/";

export async function getReviewSubmissionStats(): Promise<ReviewStats[]> {
  return reviewSubmissionInfos;
}

export async function getReviewStats(): Promise<ReviewStats[]> {
  return reviewInfos;
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

export async function addUserToPool(pool_name: string, username: string) {
  const requestOptions = buildPost({pool_name, username});
  const response = await fetch(apiPrefix + "add/pool/user", requestOptions);

  return await extractData(response);
}