export interface ReviewResponseDto {
  id: number;
  stallId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string | null;
  likeCount: number;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}
