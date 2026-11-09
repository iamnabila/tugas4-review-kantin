import {
  MenuItemRepository,
  type CreateMenuItemInput,
} from "../repositories/menuItemRepository.ts";
import type { MenuItemResponseDto } from "../dtos/menuItemDto.ts";

type MenuItemRow = NonNullable<
  Awaited<ReturnType<MenuItemRepository["findById"]>>
>;

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
  ) {
    this.menuItemRepository = menuItemRepository;
  }

  private toDto(row: MenuItemRow): MenuItemResponseDto {
    return {
      id: row.id,
      stallId: row.stallId,
      stallName: row.stallName ?? "",
      name: row.name,
      price: row.price,
      isAvailable: row.isAvailable,
    };
  }

  async getAllMenuItems(): Promise<MenuItemResponseDto[]> {
    const rows = await this.menuItemRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async getMenuItemById(id: number): Promise<MenuItemResponseDto> {
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new Error("MENU_ITEM_NOT_FOUND");
    return this.toDto(row);
  }

  async createMenuItem(
    input: CreateMenuItemInput,
  ): Promise<MenuItemResponseDto> {
    const created = await this.menuItemRepository.create(input);
    if (!created) throw new Error("MENU_ITEM_NOT_FOUND");
    const row = await this.menuItemRepository.findById(created.id);
    if (!row) throw new Error("MENU_ITEM_NOT_FOUND");
    return this.toDto(row);
  }

  async updateMenuItem(
    id: number,
    input: Partial<CreateMenuItemInput>,
  ): Promise<MenuItemResponseDto> {
    const updated = await this.menuItemRepository.update(id, input);
    if (!updated) throw new Error("MENU_ITEM_NOT_FOUND");
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new Error("MENU_ITEM_NOT_FOUND");
    return this.toDto(row);
  }

  async deleteMenuItem(id: number): Promise<MenuItemResponseDto> {
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new Error("MENU_ITEM_NOT_FOUND");
    const removed = await this.menuItemRepository.remove(id);
    if (!removed) throw new Error("MENU_ITEM_NOT_FOUND");
    return this.toDto(row);
  }
}
