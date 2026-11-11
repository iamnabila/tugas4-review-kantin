import type { Role, Stall, User } from "../types/api";

export const canCreate = (u: User | null) =>
  !!u && (u.role === "admin" || u.role === "owner");

export const canEdit = (u: User | null, s: Stall) =>
  !!u && (u.role === "admin" || (u.role === "owner" && u.id === s.ownerId));

export const canDelete = (u: User | null) => !!u && u.role === "admin";

// Nama role yang ditampilkan ke pengguna
export const roleLabel: Record<Role, string> = {
  admin: "Admin",
  owner: "Pemilik warung",
  customer: "Pelanggan",
};
