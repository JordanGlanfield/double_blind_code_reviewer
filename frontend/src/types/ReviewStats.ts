export class ReviewStats {
  review_id: string;
  repo_id: string;
  repo_name: string;
  review_name: string;
  clone_url: string;
  is_completed: boolean;

  constructor(reviewId: string, repoId: string, repoName: string, review_name: string, clone_url: string,
              is_completed: boolean) {
    this.review_id = reviewId;
    this.repo_id = repoId;
    this.repo_name = repoName;
    this.review_name = review_name;
    this.clone_url = clone_url;
    this.is_completed = is_completed;
  }
}