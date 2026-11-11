import axios from "axios";
import type { ApiFail } from "../types/api";

export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiFail>(error))
    return "Terjadi kesalahan tak terduga";
  if (!error.response)
    return "Tidak dapat terhubung ke server. Pastikan backend menyala.";
  const fromBackend = error.response.data?.message;
  switch (error.response.status) {
    case 401:
      return fromBackend ?? "Kamu perlu login dulu";
    case 403:
      return fromBackend ?? "Kamu tidak punya akses untuk aksi ini";
    case 404:
      return fromBackend ?? "Data tidak ditemukan";
    default:
      return fromBackend ?? "Terjadi kesalahan pada server";
  }
}

export function getFieldErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (axios.isAxiosError<ApiFail>(error)) {
    for (const e of error.response?.data?.errors ?? [])
      result[e.field] = e.message;
  }
  return result;
}
