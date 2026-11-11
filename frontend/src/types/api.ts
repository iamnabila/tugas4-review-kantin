export type Role = "admin" | "owner" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  status: "success";
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiFail {
  status: "fail" | "error";
  message: string;
  errors?: { field: string; message: string }[];
}

export interface StallQuery {
  search?: string;
  category?: string;
  page: number;
  limit: number;
}

// sesuai createStallSchema: hanya name yang wajib
export interface StallInput {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}
