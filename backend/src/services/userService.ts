import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/userRepository.ts";
import { AppError } from "../utils/AppError.ts";
import type { UserResponseDto } from "../dtos/userDto.ts";
import type { CreateUserBody } from "../schemas/authSchema.ts";

type UserRow = NonNullable<Awaited<ReturnType<UserRepository["findByEmail"]>>>;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as UserResponseDto["role"],
      createdAt: row.createdAt,
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const rows = await this.userRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  // Khusus admin: boleh membuat user dengan role apa pun.
  async createUser(input: CreateUserBody): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, "Email sudah terdaftar");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });
    if (!row) throw new AppError(500, "Gagal membuat user");
    return this.toDto(row);
  }
}
