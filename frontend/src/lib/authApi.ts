import api from "./http";
import type { ApiSuccess, User } from "../types/api";

export interface LoginResult {
  token: string;
  user: User;
}

export async function login(email: string, password: string) {
  const res = await api.post<ApiSuccess<LoginResult>>("/auth/login", {
    email,
    password,
  });
  return res.data.data;
}

export async function register(body: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post<ApiSuccess<User>>("/auth/register", body);
  return res.data;
}

export async function getMe() {
  const res = await api.get<ApiSuccess<User>>("/auth/me");
  return res.data.data;
}
