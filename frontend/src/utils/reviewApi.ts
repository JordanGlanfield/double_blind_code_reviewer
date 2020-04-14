import reviewSubmissionInfos from "../data/reviewSubmissionInfos.json";
import reviewInfos from "../data/reviewInfos.json";
import reviewerPools from "../data/reviewerPools.json";
import { ReviewStats } from "../types/ReviewStats";
import ReviewerPool from "../types/ReviewerPool";
import { buildPost, extractData } from "./apiUtil";

const apiPrefix = "/api/v1.0/reviews/";

export async function getReviewSubmissionStats(): Promise<ReviewStats[]> {
  return reviewSubmissionInfos;
}

export async function getReviewStats(): Promise<ReviewStats[]> {
  return reviewInfos;
}

export async function getReviewerPools(): Promise<ReviewerPool[]> {
  const response = await fetch(apiPrefix + "view/pools");


  const data = await extractData(response);
  console.log("Data: ", data)
  return data;
}

export async function createReviewerPool(name: string, description: string): Promise<number> {
  const requestOptions = buildPost({name, description});
  const response = await fetch(apiPrefix + "create/pool", requestOptions);

  return await extractData(response);
}