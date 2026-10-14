import { User } from "../data/models/user.model";
import { userData } from "../data/users.data";
import { IUsersRepository } from "./interfaces/users.interface";

export class UsersRepository implements IUsersRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    // Se compara en minúsculas para que "Ana@mail.com" y "ana@mail.com" sean el mismo usuario
    const text = email.toLowerCase();

    return userData.find((user) => user.email.toLowerCase() === text);
  }

  async createUser(data: Omit<User, "id">): Promise<User> {
    const nextId = userData.length ? Math.max(...userData.map((user) => user.id)) + 1 : 1;

    const user: User = { id: nextId, ...data };
    userData.push(user);

    return user;
  }
}