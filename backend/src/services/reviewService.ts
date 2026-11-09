import { ReviewRepository } from "../repositories/reviewRepository.ts";
import { StallRepository } from "../repositories/stallRepository.ts";
import { AppError } from "../utils/AppError.ts";
import type { ReviewResponseDto } from "../dtos/reviewDto.ts";
import type { CreateReviewBody } from "../schemas/stallSchema.ts";

type ReviewRow = NonNullable<Awaited<ReturnType<ReviewRepository["findById"]>>>;

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private stallRepository: StallRepository;

  constructor(
    reviewRepository: ReviewRepository = new ReviewRepository(),
    stallRepository: StallRepository = new StallRepository(),
  ) {
    this.reviewRepository = reviewRepository;
    this.stallRepository = stallRepository;
  }

  private toDto(row: ReviewRow): ReviewResponseDto {
    return {
      id: row.id,
      stallId: row.stallId,
      userId: row.userId,
      userName: row.userName ?? "",
      rating: row.rating,
      comment: row.comment,
      likeCount: row.likeCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async getAllReviews(): Promise<ReviewResponseDto[]> {
    const rows = await this.reviewRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  // stallId dari URL, userId dari token. Tidak ada yang diambil dari body.
  async createReview(
    stallId: number,
    userId: number,
    input: CreateReviewBody,
  ): Promise<ReviewResponseDto> {
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new AppError(404, "Data warung tidak ditemukan");

    try {
      const created = await this.reviewRepository.create({
        stallId,
        userId,
        rating: input.rating,
        comment: input.comment ?? null,
      });
      if (!created) throw new AppError(500, "Gagal membuat review");
      const row = await this.reviewRepository.findById(created.id);
      if (!row) throw new AppError(500, "Gagal membuat review");
      return this.toDto(row);
    } catch (error) {
      // MSSQL melempar error UNIQUE constraint kalau user sudah review warung ini.
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("unique")
      ) {
        throw new AppError(409, "Anda sudah pernah mereview warung ini");
      }
      throw error;
    }
  }

  async deleteReview(id: number): Promise<ReviewResponseDto> {
    const row = await this.reviewRepository.findById(id);
    if (!row) throw new AppError(404, "Data review tidak ditemukan");
    await this.reviewRepository.remove(id);
    return this.toDto(row);
  }
}
