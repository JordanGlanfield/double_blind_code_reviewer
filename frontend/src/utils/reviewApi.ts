import { ReviewStats } from "../types/ReviewStats";
import ReviewerPoolSummary from "../types/ReviewerPoolSummary";
import { buildDelete, buildPost, extractData } from "./apiUtil";
import ReviewerPool from "../types/ReviewerPool";
import Repo from "../types/Repo";
import User from "../types/User";
import ReviewFeedback from "../types/ReviewFeedback";

const apiPrefix = "/api/v1.0/reviews/";

// export async function getReviewSubmissionStats(): Promise<ReviewStats[]> {
//   return reviewSubmissionInfos;
// }

export async function isReviewer(review_id: string | undefined): Promise<boolean> {
  if (!review_id) {
    return false;
  }

  const response = await fetch(`${apiPrefix}is/reviewer/${review_id}`);
  let data = await extractData(response);

  return data.is_reviewer;
}

export async function getReviewsReceived(): Promise<ReviewStats[]> {
  const response = await fetch(apiPrefix + "view/received");
  return await extractData(response);
}

export async function getPendingReviews(): Promise<ReviewStats[]> {
  const response = await fetch(apiPrefix + "view/pending/reviews");
  let data = await extractData(response);
  console.log(data);
  return data;
}

export async function getCompletedReviews(): Promise<ReviewStats[]> {
  const response = await fetch(apiPrefix + "view/completed/reviews");
  return await extractData(response);
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
  const response = await fetch(apiPrefix + "start", requestOptions);

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

export async function getRepo(review_id?: string): Promise<Repo | undefined> {
  if (!review_id) {
    return undefined;
  }

  const response = await fetch(apiPrefix + `view/repo/${review_id}`)

  return await extractData(response);
}

export async function submitReview(review_id: string) {
  const response = await fetch(apiPrefix + `complete/review/${review_id}`, {method: "POST"})

  let data = await extractData(response, false);
  let error = data["error"];

  if (error) {
    throw error;
  }
}

export async function submitReviewFeedback(review_id: string, constructiveness: number, specificity: number,
                                           justification: number, politeness: number, feedback: string, sureness: number,
                                           guess_username: string, reason: string) {
  const requestOptions = buildPost({constructiveness, specificity, justification, politeness, feedback, sureness,
    guess_username, reason});

  const response = await fetch(apiPrefix + `feedback/${review_id}`, requestOptions);

  let data = await extractData(response, false);

  if (data.error) {
    throw data.error;
  }
}

export async function submitReviewerAnonymisationFeedback(review_id: string, sureness: number, guess_username: string,
                                                          reason: string) {
  const requestOptions = buildPost({sureness, guess_username, reason});
  const response = await fetch(apiPrefix + `anon/feedback/${review_id}`, requestOptions);

  let error = (await extractData(response, false))["error"];

  if (error) {
    throw error;
  }
}

export async function isReviewComplete(review_id: string | undefined): Promise<boolean> {
  if (!review_id) {
    return false;
  }

  const response = await fetch(apiPrefix + `is/complete/${review_id}`);
  return (await extractData(response))["is_complete"];
}

export async function isReviewFeedbackComplete(review_id: string): Promise<boolean> {
  if (!review_id) {
    return false;
  }

  const response = await fetch(apiPrefix + `is/feedback/complete/${review_id}`);
  return (await extractData(response))["is_complete"];
}

export async function getReviewFeedback(review_id: string): Promise<ReviewFeedback> {
  if (!review_id) {
    throw "No review id provided";
  }

  const response = await fetch(apiPrefix + `view/feedback/${review_id}`);
  return await extractData(response);
}

export async function getRelatedUsers(): Promise<User[]> {
  const response = await fetch(apiPrefix + "view/users/related");
  return await extractData(response);
}