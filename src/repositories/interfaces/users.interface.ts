import { User } from "../../data/models/user.model";

export interface IUsersRepository {
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: Omit<User, "id">): Promise<User>;
}