import {
  LikeRepository,
  type CreateLikeInput,
} from "../repositories/likeRepository.ts";
import type { LikeResponseDto } from "../dtos/likeDto.ts";

type LikeRow = NonNullable<Awaited<ReturnType<LikeRepository["findById"]>>>;

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(likeRepository: LikeRepository = new LikeRepository()) {
    this.likeRepository = likeRepository;
  }

  private toDto(row: LikeRow): LikeResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      userId: row.userId,
      createdAt: row.createdAt,
    };
  }

  async createLike(input: CreateLikeInput): Promise<LikeResponseDto> {
    try {
      const row = await this.likeRepository.create(input);
      if (!row) throw new Error("LIKE_NOT_FOUND");
      return this.toDto(row);
    } catch (error) {
      // MSSQL akan lempar error soal UNIQUE constraint (UQ_LIKES_review_user) kalau duplikat.
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("unique")
      ) {
        throw new Error("LIKE_ALREADY_EXISTS");
      }
      throw error;
    }
  }

  async deleteLike(id: number): Promise<LikeResponseDto> {
    const row = await this.likeRepository.remove(id);
    if (!row) throw new Error("LIKE_NOT_FOUND");
    return this.toDto(row);
  }
}
