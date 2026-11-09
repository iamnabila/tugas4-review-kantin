import {
  StallRepository,
  type FindAllParams,
} from "../repositories/stallRepository.ts";
import { MenuItemRepository } from "../repositories/menuItemRepository.ts";
import { AppError } from "../utils/AppError.ts";
import type { MenuItemDto, StallResponseDto } from "../dtos/stallDto.ts";
import type {
  CreateStallBody,
  UpdateStallBody,
} from "../schemas/stallSchema.ts";

type StallRow = NonNullable<Awaited<ReturnType<StallRepository["findById"]>>>;
type CurrentUser = { id: number; role: "admin" | "owner" | "customer" };

export class StallService {
  private stallRepository: StallRepository;
  private menuItemRepository: MenuItemRepository;

  constructor(
    stallRepository: StallRepository = new StallRepository(),
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
  ) {
    this.stallRepository = stallRepository;
    this.menuItemRepository = menuItemRepository;
  }

  // Mapping row DB -> DTO API (sekaligus logika bisnis isPopular).
  private toDto(row: StallRow): StallResponseDto {
    const avgRating = Number(row.avgRating);
    return {
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      category: row.category,
      location: row.location,
      description: row.description,
      avgRating,
      reviewCount: row.reviewCount,
      isPopular: avgRating >= 4.7,
    };
  }

  private async findOrFail(id: number): Promise<StallRow> {
    const row = await this.stallRepository.findById(id);
    if (!row) throw new AppError(404, "Data warung tidak ditemukan");
    return row;
  }

  async getAllStalls(params: FindAllParams) {
    const { rows, total } = await this.stallRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getStallById(id: number): Promise<StallResponseDto> {
    return this.toDto(await this.findOrFail(id));
  }

  async getStallMenus(id: number): Promise<MenuItemDto[]> {
    await this.findOrFail(id);
    return this.menuItemRepository.findByStallId(id);
  }

  // ownerId diambil dari token (user yang sedang login), BUKAN dari body.
  async createStall(
    input: CreateStallBody,
    user: CurrentUser,
  ): Promise<StallResponseDto> {
    const row = await this.stallRepository.create({
      ...input,
      ownerId: user.id,
    });
    if (!row) throw new AppError(500, "Gagal membuat warung");
    return this.toDto(row);
  }

  async updateStall(
    id: number,
    input: UpdateStallBody,
    user: CurrentUser,
  ): Promise<StallResponseDto> {
    const stall = await this.findOrFail(id);

    // Owner hanya boleh mengubah warung miliknya sendiri. Admin bebas.
    if (user.role === "owner" && stall.ownerId !== user.id) {
      throw new AppError(
        403,
        "Anda hanya boleh mengubah warung milik Anda sendiri",
      );
    }

    const row = await this.stallRepository.update(id, input);
    if (!row) throw new AppError(404, "Data warung tidak ditemukan");
    return this.toDto(row);
  }

  async deleteStall(id: number): Promise<StallResponseDto> {
    await this.findOrFail(id);
    const row = await this.stallRepository.remove(id);
    if (!row) throw new AppError(404, "Data warung tidak ditemukan");
    return this.toDto(row);
  }
}
