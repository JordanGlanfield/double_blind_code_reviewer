export class ReviewStats {
  review_id: string;
  repo_id: string;
  repo_name: string;
  clone_url: string;
  status: string;

  constructor(reviewId: string, repoId: string, repoName: string, clone_url: string, status: string) {
    this.review_id = reviewId;
    this.repo_id = repoId;
    this.repo_name = repoName;
    this.clone_url = clone_url;
    this.status = status;
  }
}