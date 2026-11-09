export interface FlagResponseDto {
  id: number;
  reviewId: number;
  reportedBy: number;
  reason: string | null;
  status: "pending" | "resolved" | "dismissed";
  createdAt: Date | string | null;
}
