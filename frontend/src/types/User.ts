class User {
  username: string;
  first_name: string;
  surname: string;

  constructor(username: string, first_name: string, surname: string) {
    this.username = username;
    this.first_name = first_name;
    this.surname = surname;
  }
}

export default User;