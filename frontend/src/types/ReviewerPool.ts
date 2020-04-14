import User from "./User";

class ReviewerPool {
  name: string;
  description: string;
  owner: User;
  members: User[];

  constructor(name: string, description: string, owner: User, members: User[]) {
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.members = members;
  }
}

export default ReviewerPool;