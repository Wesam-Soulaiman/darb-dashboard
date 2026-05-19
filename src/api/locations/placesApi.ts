import { apiClient } from "../apiClient";
import type {
  CreatePlacePayload,
  GetPlacesParams,
  Place,
  PlacesResponse,
  UpdatePlacePayload,
} from "../../types/place.types";

const PLACES_ENDPOINT = "/places";

export const placesApi = {
  getAll: async (params?: GetPlacesParams) => {
    const response = await apiClient.get<PlacesResponse>(PLACES_ENDPOINT, {
      params,
    });

    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Place>(`${PLACES_ENDPOINT}/${id}`);

    return response.data;
  },

  create: async (payload: CreatePlacePayload) => {
    const response = await apiClient.post<Place>(PLACES_ENDPOINT, payload);

    return response.data;
  },

  update: async (id: number, payload: UpdatePlacePayload) => {
    const response = await apiClient.patch<Place>(
      `${PLACES_ENDPOINT}/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<Place>(`${PLACES_ENDPOINT}/${id}`);

    return response.data;
  },
};
