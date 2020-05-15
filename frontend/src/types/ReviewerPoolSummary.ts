class ReviewerPoolSummary {
  id: number;
  name: string;
  description: string;
  num_members: number;

  constructor(id:number, name: string, description: string, num_members: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.num_members = num_members;
  }
}

export default ReviewerPoolSummary;