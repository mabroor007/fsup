import { Database, aql } from "arangojs";

export class User {
  username: string;
  password: string;
  constructor() {
    this.username = "";
    this.password = "";
  }
}

export class UserService {
  constructor(private db: Database) {}

  private usersCollection() {
    return this.db.collection<User>("users");
  }

  // unsure code
  async signup(username: string, password: string) {
    const result = await this.db.query(
      aql`insert ${{ username, password }} into users`
    );
    return result;
  }

  async login(username: string, password: string) {
    // first find the users with particular username
    const result = await this.db.query(
      aql`FOR u in users filter u.username == ${username} return u`
    );

    const users: User[] = await result.all();

    if (users.length < 1) return "user not found";

    if (users[0].password !== password) return false;

    return true;
  }
}
