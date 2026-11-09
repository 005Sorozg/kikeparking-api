export interface CreateReviewRequestDTO {
  // De 1 a 5
  rating: number;
  comment?: string;
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