export interface CreateReviewRequestDTO {
  // De 1 a 5
  rating: number;
  comment?: string;
}

// Calificación del usuario que inició sesión: conductor = lo que le dan los propietarios;
// propietario = el promedio de todas las reseñas de sus parqueaderos
export interface RatingSummaryResponseDTO {
  // Promedio con un decimal (0 si todavía no tiene reseñas)
  rating: number;
  reviewCount: number;
}

export interface ReviewResponseDTO {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: {
    name: string;
    avatarUrl: string | null;
  };
}