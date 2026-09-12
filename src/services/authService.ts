import { api } from "./api";

export interface AuthUser {
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roleId: number;
  roleName: string;
  theme: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),

  refresh: (accessToken: string, refreshToken: string) =>
    api.post<AuthResponse>("/auth/refresh", { accessToken, refreshToken }),
};
