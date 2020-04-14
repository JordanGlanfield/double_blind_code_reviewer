class ReviewerPoolSummary {
  id: number;
  name: string;
  description: string;
  numMembers: number;

  constructor(id:number, name: string, description: string, numMembers: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.numMembers = numMembers;
  }
}

export default ReviewerPoolSummary;