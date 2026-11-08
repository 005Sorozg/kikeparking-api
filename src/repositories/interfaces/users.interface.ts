import { User } from "../../data/models/user.model";

export interface IUsersRepository {
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: Omit<User, "id">): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateAvatar(id: number, avatarUrl: string | null): Promise<User>;
  updateUser(id: number, data: Partial<Pick<User, "name" | "email">>): Promise<User>;
}