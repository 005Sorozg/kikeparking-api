import { UserRole } from "../data/models/user.model";

// Datos que el cliente envía para registrarse
export interface RegisterUserRequestDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Lo que la API devuelve de un usuario (nunca la contraseña, ni siquiera encriptada)
export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Datos que el cliente envía para iniciar sesión
export interface LoginRequestDTO {
  email: string;
  password: string;
}

// Lo que devuelve el login: el usuario y el token para las siguientes peticiones
export interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
}