import { api } from "./api";

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roleId: number;
  roleName: string;
  theme: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  roleId: number;
  theme: string;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roleId: number;
  theme: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  getAll: () => api.get<User[]>("/users"),

  create: (payload: CreateUserPayload) => api.post<User>("/users", payload),

  update: (userId: number, payload: UpdateUserPayload) =>
    api.put<User>(`/users/${userId}`, payload),

  changePassword: (userId: number, payload: ChangePasswordPayload) =>
    api.put<{ message: string }>(`/users/${userId}/change-password`, payload),

  delete: (userId: number) =>
    api.delete<{ message: string }>(`/users/${userId}`),
};
