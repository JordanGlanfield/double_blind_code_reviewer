class ReviewerPool {
  name: string;
  description: string;
  numMembers: number;

  constructor(name: string, description: string, numMembers: number) {
    this.name = name;
    this.description = description;
    this.numMembers = numMembers;
  }
}

export default ReviewerPool;