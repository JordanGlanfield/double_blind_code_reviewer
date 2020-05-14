export class ReviewStats {
  review_id: string;
  repo_id: string;
  repo_name: string;
  status: string;

  constructor(reviewId: string, repoId: string, repoName: string, status: string) {
    this.review_id = reviewId;
    this.repo_id = repoId;
    this.repo_name = repoName;
    this.status = status;
  }
}