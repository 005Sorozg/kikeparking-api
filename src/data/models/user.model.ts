export const USER_ROLES = ["conductor", "propietario"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  // Aquí se guarda la contraseña ya encriptada, nunca la original
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string | null;
}

// Lo que se muestra del propietario en el detalle de un parqueadero
export interface OwnerProfile {
  id: number;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  // Cuántos parqueaderos tiene publicados
  parkingSpotCount: number;
}