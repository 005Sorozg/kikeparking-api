import { OwnerProfile, User } from "../../data/models/user.model";

export interface IUsersRepository {
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: Omit<User, "id">): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateAvatar(id: number, avatarUrl: string | null): Promise<User>;
  updateUser(id: number, data: Partial<Pick<User, "name" | "email">>): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  updatePassword(id: number, passwordHash: string): Promise<void>;
  // Nombre, foto, fecha de registro y cantidad de parqueaderos de un propietario
  getOwnerProfile(id: number): Promise<OwnerProfile | undefined>;
}