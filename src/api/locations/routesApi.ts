import { apiClient } from "../apiClient";
import type {
  CreateRoutePayload,
  GetRoutesParams,
  RoutesResponse,
  TransitRoute,
  UpdateRoutePayload,
  UpdateRouteStopsPayload,
} from "../../types/route.types";

const ROUTES_ENDPOINT = "/routes";

export const routesApi = {
  getAll: async (params?: GetRoutesParams) => {
    const response = await apiClient.get<RoutesResponse>(ROUTES_ENDPOINT, {
      params,
    });

    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<TransitRoute>(`${ROUTES_ENDPOINT}/${id}`);

    return response.data;
  },

  create: async (payload: CreateRoutePayload) => {
    const response = await apiClient.post<TransitRoute>(ROUTES_ENDPOINT, payload);

    return response.data;
  },

  update: async (id: string, payload: UpdateRoutePayload) => {
    const response = await apiClient.patch<TransitRoute>(
      `${ROUTES_ENDPOINT}/${id}`,
      payload,
    );

    return response.data;
  },

  updateStops: async (id: string, payload: UpdateRouteStopsPayload) => {
    const response = await apiClient.patch<TransitRoute>(
      `${ROUTES_ENDPOINT}/${id}/stops`,
      payload,
    );

    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<TransitRoute>(`${ROUTES_ENDPOINT}/${id}`);

    return response.data;
  },
};
