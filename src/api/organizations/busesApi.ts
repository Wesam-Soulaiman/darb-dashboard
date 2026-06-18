import { apiClient } from "../apiClient";
import type {
  Bus,
  BusesResponse,
  CreateBusPayload,
  GetBusesParams,
  UpdateBusPayload,
} from "../../types/bus.types";

const getOrganizationBusesEndpoint = (orgId: number) => `/organizations/${orgId}/buses`;

export const busesApi = {
  getAll: async (orgId: number, params?: GetBusesParams) => {
    const response = await apiClient.get<BusesResponse>(
      getOrganizationBusesEndpoint(orgId),
      {
        params,
      },
    );

    return response.data;
  },

  getById: async (orgId: number, id: number) => {
    const response = await apiClient.get<Bus>(
      `${getOrganizationBusesEndpoint(orgId)}/${id}`,
    );

    return response.data;
  },

  create: async (orgId: number, payload: CreateBusPayload) => {
    const response = await apiClient.post<Bus>(
      getOrganizationBusesEndpoint(orgId),
      payload,
    );

    return response.data;
  },

  update: async (orgId: number, id: number, payload: UpdateBusPayload) => {
    const response = await apiClient.patch<Bus>(
      `${getOrganizationBusesEndpoint(orgId)}/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (orgId: number, id: number) => {
    await apiClient.delete<void>(`${getOrganizationBusesEndpoint(orgId)}/${id}`);
  },
};
