import User from "./User";

class ReviewerPool {
  name: string;
  description: string;
  invite_code: string;
  owner: User;
  members: User[];

  constructor(name: string, description: string, invite_code: string, owner: User, members: User[]) {
    this.name = name;
    this.description = description;
    this.invite_code = invite_code;
    this.owner = owner;
    this.members = members;
  }
}

export default ReviewerPool;