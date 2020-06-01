class User {
  username: string;
  first_name: string;
  surname: string;
  is_admin: boolean;

  constructor(username: string, first_name: string, surname: string, is_admin: boolean) {
    this.username = username;
    this.first_name = first_name;
    this.surname = surname;
    this.is_admin = is_admin;
  }
}

export default User;