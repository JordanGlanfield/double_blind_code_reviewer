import reviewInfos from "../data/reviewInfos.json";
import { ReviewStats } from "../types/ReviewStats";

export async function getReviewInfos(): Promise<ReviewStats[]> {
  return reviewInfos;
}