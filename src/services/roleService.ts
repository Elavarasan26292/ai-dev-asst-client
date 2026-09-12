import { api } from "./api";

export interface Permission {
  permissionId: string;
  permissionName: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  permissions: Permission[];
}

export interface CreateRolePayload {
  roleName: string;
  permissionIds: string[];
}

export interface UpdateRolePayload {
  roleName: string;
  permissionIds: string[];
}

export const roleService = {
  getAll: () => api.get<Role[]>("/roles"),

  getPermissions: () => api.get<Permission[]>("/roles/permissions"),

  create: (payload: CreateRolePayload) => api.post<Role>("/roles", payload),

  update: (roleId: number, payload: UpdateRolePayload) =>
    api.put<Role>(`/roles/${roleId}`, payload),

  delete: (roleId: number) =>
    api.delete<{ message: string }>(`/roles/${roleId}`),
};
