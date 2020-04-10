import reviewInfos from "../data/reviewInfos.json";
import { ReviewStats } from "../types/ReviewStats";

export async function getReviewStats(): Promise<ReviewStats[]> {
  return reviewInfos;
}