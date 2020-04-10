export class ReviewStats {
  repoName: string;
  branch: string;
  approvals: number;
  rejections: number;
  newComments: number;

  constructor(repoName: string, branch: string, approvals: number, rejections: number, newComments: number) {
    this.repoName = repoName;
    this.branch = branch;
    this.approvals = approvals;
    this.rejections = rejections;
    this.newComments = newComments;
  }
}