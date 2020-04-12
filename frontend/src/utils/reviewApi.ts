import reviewSubmissionInfos from "../data/reviewSubmissionInfos.json";
import reviewInfos from "../data/reviewInfos.json";
import reviewerPools from "../data/reviewerPools.json";
import { ReviewStats } from "../types/ReviewStats";
import ReviewerPool from "../types/ReviewerPool";

export async function getReviewSubmissionStats(): Promise<ReviewStats[]> {
  return reviewSubmissionInfos;
}

export async function getReviewStats(): Promise<ReviewStats[]> {
  return reviewInfos;
}

export async function getReviewerPools(): Promise<ReviewerPool[]> {
  return reviewerPools;
}