import type { Permission } from "./permission.types";

export interface Role {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface RolesResponse {
  data: Role[];
}

export interface GetRolesParams {
  search?: string;
}

export interface CreateRolePayload {
  name: string;
  description: string;
}

export interface UpdateRolePayload {
  name: string;
  description: string;
}

export interface UpdateRolePermissionsPayload {
  permissionIds: number[];
}
