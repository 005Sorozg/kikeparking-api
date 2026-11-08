import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, USER_ROLES } from "../data/models/user.model";
import { LoginRequestDTO, LoginResponseDTO, RegisterUserRequestDTO, UpdateUserRequestDTO, UserResponseDTO } from "../dto/users.dto";
import { env } from "../config/env";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { IUsersRepository } from "../repositories/interfaces/users.interface";
import { IUsersService } from "./interfaces/users.interface";
import { IImageStorage, UploadedFileData } from "./interfaces/image-storage.interface";

// Cantidad de "rondas" que usa bcrypt para encriptar: más alto es más seguro pero más lento
const SALT_ROUNDS = 10;

export class UsersService implements IUsersService {
    constructor(
    readonly usersRepository: IUsersRepository,
    readonly imageStorage: IImageStorage,
  ) {}

  async registerUser(data: RegisterUserRequestDTO): Promise<UserResponseDTO> {
    const problems = this.validateRegisterData(data);

    if (problems.length > 0) {
      const error = AppErrors.USER_INVALID_DATA;

      throw new AppException(error.code, `${error.message}: ${problems.join(", ")}`, error.statusCode);
    }

    const existing = await this.usersRepository.getUserByEmail(data.email);

    if (existing) {
      const error = AppErrors.USER_EMAIL_IN_USE;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    // La contraseña nunca se guarda tal cual, solo su versión encriptada
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await this.usersRepository.createUser({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash,
      role: data.role,
    });

    return this.toResponseDTO(user);
  }

  async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.usersRepository.getUserByEmail(data.email ?? "");

    // Se usa el mismo error tanto si el correo no existe como si la contraseña está mal,
    // para no darle pistas a quien intenta adivinar
    if (!user) {
      const error = AppErrors.USER_INVALID_CREDENTIALS;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const passwordMatches = await bcrypt.compare(data.password ?? "", user.passwordHash);

    if (!passwordMatches) {
      const error = AppErrors.USER_INVALID_CREDENTIALS;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
      expiresIn: "7d",
    });

    return {
      user: this.toResponseDTO(user),
      token,
    };
  }

    async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.usersRepository.getAllUsers();

    return users.map((user) => this.toResponseDTO(user));
  }

    // Sube la foto de perfil. Cada usuario tiene un id fijo en Cloudinary,
  // así que una foto nueva reemplaza a la anterior.
  async updateAvatar(userId: number, file: UploadedFileData | undefined): Promise<UserResponseDTO> {
    if (!file) {
      const error = AppErrors.UPLOAD_NO_FILE;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const uploaded = await this.imageStorage.upload(file.buffer, {
      folder: "kikeparking/avatars",
      publicId: `user-${userId}`,
      maxSize: 512,
    });

    const user = await this.usersRepository.updateAvatar(userId, uploaded.url);

    return this.toResponseDTO(user);
  }

  // Quita la foto de perfil: la app vuelve a mostrar el ícono por defecto
  async removeAvatar(userId: number): Promise<UserResponseDTO> {
    await this.imageStorage.delete(`kikeparking/avatars/user-${userId}`);

    const user = await this.usersRepository.updateAvatar(userId, null);

    return this.toResponseDTO(user);
  }

  // Cambia el nombre y/o el correo del usuario que inició sesión
async updateProfile(userId: number, data: UpdateUserRequestDTO): Promise<UserResponseDTO> {
  const problems = this.validateUpdateData(data);

  if (problems.length > 0) {
    const error = AppErrors.USER_INVALID_DATA;

    throw new AppException(error.code, `${error.message}: ${problems.join(", ")}`, error.statusCode);
  }

  const changes: { name?: string; email?: string } = {};

  if (data.name !== undefined) {
    changes.name = data.name.trim();
  }

  if (data.email !== undefined) {
    const email = data.email.trim().toLowerCase();
    const existing = await this.usersRepository.getUserByEmail(email);

    // Si el correo ya es de OTRA persona se rechaza; si es el mismo del usuario, no hay problema
    if (existing && existing.id !== userId) {
      const error = AppErrors.USER_EMAIL_IN_USE;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    changes.email = email;
  }

  const user = await this.usersRepository.updateUser(userId, changes);

  return this.toResponseDTO(user);
}

  private validateRegisterData(data: RegisterUserRequestDTO): string[] {
    const problems: string[] = [];

    if (typeof data?.name !== "string" || data.name.trim().length < 3) {
      problems.push("name debe tener al menos 3 caracteres");
    }

    if (typeof data?.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      problems.push("email debe ser un correo válido");
    }

    if (typeof data?.password !== "string" || data.password.length < 6) {
      problems.push("password debe tener al menos 6 caracteres");
    }

    if (!(USER_ROLES as readonly string[]).includes(data?.role)) {
      problems.push("role debe ser 'conductor' o 'propietario'");
    }

    return problems;
  }

  private validateUpdateData(data: UpdateUserRequestDTO): string[] {
  const problems: string[] = [];

  if (data?.name === undefined && data?.email === undefined) {
    problems.push("debes enviar name o email");
  }

  if (data?.name !== undefined && (typeof data.name !== "string" || data.name.trim().length < 3)) {
    problems.push("name debe tener al menos 3 caracteres");
  }

  if (data?.email !== undefined && (typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
    problems.push("email debe ser un correo válido");
  }

  return problems;
}

  // Convierte el modelo interno al formato que se devuelve al cliente (sin passwordHash)
  private toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl ?? null,
    };
  }
}