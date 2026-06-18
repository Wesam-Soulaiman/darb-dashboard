import { apiClient } from "../apiClient";
import type {
  CreateRolePayload,
  GetRolesParams,
  Role,
  RolesResponse,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
} from "../../types/role.types";

const ROLES_ENDPOINT = "/roles";

export const rolesApi = {
  getAll: async (params?: GetRolesParams) => {
    const response = await apiClient.get<RolesResponse>(ROLES_ENDPOINT, {
      params,
    });

    return response.data.data;
  },

  create: async (payload: CreateRolePayload) => {
    const response = await apiClient.post<Role>(ROLES_ENDPOINT, payload);

    return response.data;
  },

  update: async (id: number, payload: UpdateRolePayload) => {
    const response = await apiClient.patch<Role>(`${ROLES_ENDPOINT}/${id}`, payload);

    return response.data;
  },

  assignPermissions: async (id: number, payload: UpdateRolePermissionsPayload) => {
    const response = await apiClient.post<Role>(
      `${ROLES_ENDPOINT}/${id}/permissions`,
      payload,
    );

    return response.data;
  },

  removePermissions: async (id: number, payload: UpdateRolePermissionsPayload) => {
    const response = await apiClient.delete<Role>(`${ROLES_ENDPOINT}/${id}/permissions`, {
      data: payload,
    });

    return response.data;
  },
};
