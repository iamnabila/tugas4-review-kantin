import axios from "axios";
import type { ApiFail } from "../types/api";

export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiFail>(error))
    return "Terjadi kesalahan. Coba lagi beberapa saat.";
  if (!error.response)
    return "Tidak dapat terhubung ke server. Periksa koneksi, lalu coba lagi.";
  const fromBackend = error.response.data?.message;
  switch (error.response.status) {
    case 401:
      return fromBackend ?? "Silakan masuk terlebih dahulu.";
    case 403:
      return fromBackend ?? "Kamu tidak punya akses untuk tindakan ini.";
    case 404:
      return fromBackend ?? "Data tidak ditemukan.";
    default:
      return fromBackend ?? "Terjadi kesalahan. Coba lagi beberapa saat.";
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
