import api from "./http";
import type { ApiSuccess, Stall, StallInput, StallQuery } from "../types/api";

export async function getStalls(query: StallQuery) {
  // hanya kirim search/category kalau diisi
  const params: Record<string, string | number> = {
    page: query.page,
    limit: query.limit,
  };
  if (query.search) params.search = query.search;
  if (query.category) params.category = query.category;
  const res = await api.get<ApiSuccess<Stall[]>>("/stalls", { params });
  return res.data; // berisi data (Stall[]) dan meta (pagination)
}

export async function getStall(id: number) {
  const res = await api.get<ApiSuccess<Stall>>(`/stalls/${id}`);
  return res.data.data;
}

export async function createStall(body: StallInput) {
  const res = await api.post<ApiSuccess<Stall>>("/stalls", body);
  return res.data.data;
}

export async function updateStall(id: number, body: StallInput) {
  const res = await api.put<ApiSuccess<Stall>>(`/stalls/${id}`, body);
  return res.data.data;
}

export async function deleteStall(id: number) {
  await api.delete(`/stalls/${id}`);
}
