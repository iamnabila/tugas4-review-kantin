import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository.ts";
import { AppError } from "../utils/AppError.ts";
import type { UserResponseDto } from "../dtos/userDto.ts";
import type { LoginBody, RegisterBody } from "../schemas/authSchema.ts";

type UserRow = NonNullable<Awaited<ReturnType<UserRepository["findById"]>>>;

export class AuthService {
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

  // Register publik SELALU jadi customer. Role tidak boleh dari body.
  async register(input: RegisterBody): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, "Email sudah terdaftar");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "customer",
    });
    if (!row) throw new AppError(500, "Gagal membuat user");
    return this.toDto(row);
  }

  async login(input: LoginBody) {
    const row = await this.userRepository.findByEmail(input.email);
    const valid = row
      ? await bcrypt
          .compare(input.password, row.passwordHash)
          .catch(() => false)
      : false;
    if (!row || !valid) throw new AppError(401, "Email atau password salah");

    const token = jwt.sign(
      { id: row.id, role: row.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );
    return { token, user: this.toDto(row) };
  }

  async me(userId: number): Promise<UserResponseDto> {
    const row = await this.userRepository.findById(userId);
    if (!row) throw new AppError(401, "User pada token tidak ditemukan");
    return this.toDto(row);
  }
}
