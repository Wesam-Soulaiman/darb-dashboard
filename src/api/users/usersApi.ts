import { apiClient } from "../apiClient";
import type {
  CreateUserPayload,
  GetUsersParams,
  UpdateMyProfilePayload,
  UpdateUserPayload,
  User,
  UsersResponse,
} from "../../types/user.types";

const USERS_ENDPOINT = "/users";
const ORGANIZATIONS_ENDPOINT = "/organizations";
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
    const response = await apiClient.post<User>(USERS_ENDPOINT, payload);

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

  getOrganizationUsers: async (orgId: number, params?: GetUsersParams) => {
    const response = await apiClient.get<UsersResponse>(
      `${ORGANIZATIONS_ENDPOINT}/${orgId}/users`,
      {
        params,
      },
    );

    return response.data;
  },

  createOrganizationUser: async (orgId: number, payload: CreateUserPayload) => {
    const response = await apiClient.post<User>(
      `${ORGANIZATIONS_ENDPOINT}/${orgId}/users`,
      payload,
    );

    return response.data;
  },

  removeFromOrganization: async (orgId: number, id: number) => {
    await apiClient.delete<void>(
      `${ORGANIZATIONS_ENDPOINT}/${orgId}/users/${id}`,
    );
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
