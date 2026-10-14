export const USER_ROLES = ["conductor", "propietario"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  // Aquí se guarda la contraseña ya encriptada, nunca la original
  passwordHash: string;
  role: UserRole;
}