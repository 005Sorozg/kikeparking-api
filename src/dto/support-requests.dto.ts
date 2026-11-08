// Datos que el usuario envía desde el formulario de ayuda
export interface CreateSupportRequestRequestDTO {
  subject: string;
  message: string;
}

// Lo que la API devuelve de una solicitud
export interface SupportRequestResponseDTO {
  id: number;
  subject: string;
  message: string;
  createdAt: string;
}