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

    async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });

    return users as User[];
  }
    async updateAvatar(id: number, avatarUrl: string | null): Promise<User> {
    const user = await prisma.user.update({ where: { id }, data: { avatarUrl } });

    return user as User;
  }
  async updateUser(id: number, data: Partial<Pick<User, "name" | "email">>): Promise<User> {
  const user = await prisma.user.update({ where: { id }, data });

  return user as User;
}
async getUserById(id: number): Promise<User | undefined> {
  const user = await prisma.user.findUnique({ where: { id } });

  return (user as User) ?? undefined;
}

async updatePassword(id: number, passwordHash: string): Promise<void> {
  await prisma.user.update({ where: { id }, data: { passwordHash } });
}
}