import { apiClient } from "../apiClient";

import type {
  CreateTripPayload,
  GetTripsParams,
  ReplaceTripFrequenciesPayload,
  ReplaceTripStopTimesPayload,
  Trip,
  TripDetails,
  TripFrequency,
  TripPreviewTimesResponse,
  TripsResponse,
  TripStopTime,
  UpdateTripPayload,
} from "../../types/trip.types";

const getTripsEndpoint = (orgId: number) => `/organizations/${orgId}/trips`;

export const tripsApi = {
  getAll: async (orgId: number, params?: GetTripsParams) => {
    const response = await apiClient.get<TripsResponse>(getTripsEndpoint(orgId), {
      params,
    });

    return response.data;
  },

  getById: async (orgId: number, tripId: number) => {
    const response = await apiClient.get<TripDetails>(
      `${getTripsEndpoint(orgId)}/${tripId}`,
    );

    return response.data;
  },

  create: async (orgId: number, payload: CreateTripPayload) => {
    const response = await apiClient.post<Trip>(getTripsEndpoint(orgId), payload);

    return response.data;
  },

  update: async (orgId: number, tripId: number, payload: UpdateTripPayload) => {
    const response = await apiClient.patch<Trip>(
      `${getTripsEndpoint(orgId)}/${tripId}`,
      payload,
    );

    return response.data;
  },

  delete: async (orgId: number, tripId: number) => {
    await apiClient.delete(`${getTripsEndpoint(orgId)}/${tripId}`);
  },

  replaceStopTimes: async (
    orgId: number,
    tripId: number,
    payload: ReplaceTripStopTimesPayload,
  ) => {
    const response = await apiClient.put<TripStopTime[]>(
      `${getTripsEndpoint(orgId)}/${tripId}/stop-times`,
      payload,
    );

    return response.data;
  },

  replaceFrequencies: async (
    orgId: number,
    tripId: number,
    payload: ReplaceTripFrequenciesPayload,
  ) => {
    const response = await apiClient.put<TripFrequency[]>(
      `${getTripsEndpoint(orgId)}/${tripId}/frequencies`,
      payload,
    );

    return response.data;
  },

  previewTimes: async (orgId: number, tripId: number, date: string) => {
    const response = await apiClient.get<TripPreviewTimesResponse>(
      `${getTripsEndpoint(orgId)}/${tripId}/preview-times`,
      {
        params: {
          date,
        },
      },
    );

    return response.data;
  },
};
