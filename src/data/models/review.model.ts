export const REVIEW_TARGETS = ["parking_spot", "driver"] as const;
// "parking_spot": el conductor calificó el parqueadero; "driver": el propietario calificó al conductor
export type ReviewTarget = (typeof REVIEW_TARGETS)[number];

export interface Review {
  id: number;
  bookingId: number;
  target: ReviewTarget;
  authorId: number;
  parkingSpotId: number;
  driverId: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

// Reseña con el nombre y la foto de quien la escribió
export interface ReviewWithAuthor extends Review {
  author: {
    name: string;
    avatarUrl: string | null;
  };
}