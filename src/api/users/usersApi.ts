import { apiClient } from "../apiClient";
import type {
  AssignUserRolePayload,
  AssignUserRoleResponse,
  CreatedUser,
  CreateUserPayload,
  GetUsersParams,
  OperationalProfile,
  UnassignUserRolePayload,
  UnassignUserRoleResponse,
  UpdateMyProfilePayload,
  UpdateOperationalProfilePayload,
  UpdateUserPayload,
  User,
  UsersResponse,
} from "../../types/user.types";

const USERS_ENDPOINT = "/users";
const ME_ENDPOINT = "/me";

export const usersApi = {
  getAll: async (params?: GetUsersParams) => {
    const response = await apiClient.get<UsersResponse>(USERS_ENDPOINT, {
      params,
    });

    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<User>(`${USERS_ENDPOINT}/${id}`);

    return response.data;
  },

  create: async (payload: CreateUserPayload) => {
    const response = await apiClient.post<CreatedUser>(USERS_ENDPOINT, payload);

    return response.data;
  },

  update: async (id: number, payload: UpdateUserPayload) => {
    const response = await apiClient.patch<User>(
      `${USERS_ENDPOINT}/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete<void>(`${USERS_ENDPOINT}/${id}`);
  },

  assignRole: async (userId: number, payload: AssignUserRolePayload) => {
    const response = await apiClient.patch<AssignUserRoleResponse>(
      `${USERS_ENDPOINT}/${userId}/roles`,
      payload,
    );

    return response.data;
  },

  unassignRole: async (userId: number, payload: UnassignUserRolePayload) => {
    const response = await apiClient.delete<UnassignUserRoleResponse>(
      `${USERS_ENDPOINT}/${userId}/roles`,
      {
        data: payload,
      },
    );

    return response.data;
  },

  updateOperationalProfile: async (
    userId: number,
    payload: UpdateOperationalProfilePayload,
  ) => {
    const response = await apiClient.patch<OperationalProfile>(
      `${USERS_ENDPOINT}/${userId}/profile`,
      payload,
    );

    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<User>(ME_ENDPOINT);

    return response.data;
  },

  updateMyProfile: async (payload: UpdateMyProfilePayload) => {
    const response = await apiClient.patch<User>(
      `${ME_ENDPOINT}/profile`,
      payload,
    );

    return response.data;
  },
};
