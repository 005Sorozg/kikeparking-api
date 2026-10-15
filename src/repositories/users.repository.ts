import { User } from "../data/models/user.model";
import { prisma } from "../config/prisma";
import { IUsersRepository } from "./interfaces/users.interface";

export class UsersRepository implements IUsersRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    return (user as User) ?? undefined;
  }

  async createUser(data: Omit<User, "id">): Promise<User> {
    const user = await prisma.user.create({ data });

    return user as User;
  }
}