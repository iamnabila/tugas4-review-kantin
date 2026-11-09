import {
  AuditLogRepository,
  type CreateAuditLogInput,
} from "../repositories/auditLogRepository.ts";
import type { AuditLogResponseDto } from "../dtos/auditLogDto.ts";

type AuditLogRow = Awaited<ReturnType<AuditLogRepository["create"]>>;

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(
    auditLogRepository: AuditLogRepository = new AuditLogRepository(),
  ) {
    this.auditLogRepository = auditLogRepository;
  }

  private toDto(row: NonNullable<AuditLogRow>): AuditLogResponseDto {
    return {
      id: row.id,
      userId: row.userId,
      action: row.action,
      targetTable: row.targetTable,
      targetId: row.targetId,
      metadata: row.metadata,
      createdAt: row.createdAt,
    };
  }

  async getAllAuditLogs(): Promise<AuditLogResponseDto[]> {
    const rows = await this.auditLogRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createAuditLog(
    input: CreateAuditLogInput,
  ): Promise<AuditLogResponseDto> {
    const row = await this.auditLogRepository.create(input);
    if (!row) throw new Error("AUDIT_LOG_NOT_FOUND");
    return this.toDto(row);
  }
}
