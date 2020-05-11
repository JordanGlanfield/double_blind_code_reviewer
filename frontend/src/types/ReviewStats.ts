export class ReviewStats {
  repoName: string;
  status: string;

  constructor(repoName: string, status: string) {
    this.repoName = repoName;
    this.status = status;
  }
}