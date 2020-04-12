import reviewSubmissionInfos from "../data/reviewSubmissionInfos.json";
import reviewInfos from "../data/reviewInfos.json";
import { ReviewStats } from "../types/ReviewStats";

export async function getReviewSubmissionStats(): Promise<ReviewStats[]> {
  return reviewSubmissionInfos;
}

export async function getReviewStats(): Promise<ReviewStats[]> {
  return reviewInfos;
}