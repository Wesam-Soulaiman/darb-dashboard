import { apiClient } from "../apiClient";
import type {
  CreateStopPayload,
  GetStopsParams,
  Stop,
  StopsResponse,
  UpdateStopPayload,
} from "../../types/stop.types";

const STOPS_ENDPOINT = "/stops";

export const stopsApi = {
  getAll: async (params?: GetStopsParams) => {
    const response = await apiClient.get<StopsResponse>(STOPS_ENDPOINT, {
      params,
    });

    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Stop>(`${STOPS_ENDPOINT}/${id}`);

    return response.data;
  },

  create: async (payload: CreateStopPayload) => {
    const response = await apiClient.post<Stop>(STOPS_ENDPOINT, payload);

    return response.data;
  },

  update: async (id: string, payload: UpdateStopPayload) => {
    const response = await apiClient.patch<Stop>(
      `${STOPS_ENDPOINT}/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<Stop>(`${STOPS_ENDPOINT}/${id}`);

    return response.data;
  },
};
