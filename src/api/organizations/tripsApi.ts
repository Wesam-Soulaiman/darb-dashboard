import { apiClient } from "../apiClient";

import { localGtfsTimeToUtc, utcGtfsTimeToLocal } from "../../utils/gtfsTimeZone";

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

const mapStopTimeToLocal = (stopTime: TripStopTime): TripStopTime => ({
  ...stopTime,

  arrivalTime: utcGtfsTimeToLocal(stopTime.arrivalTime),

  departureTime: utcGtfsTimeToLocal(stopTime.departureTime),
});

const mapFrequencyToLocal = (frequency: TripFrequency): TripFrequency => ({
  ...frequency,

  startTime: utcGtfsTimeToLocal(frequency.startTime),

  endTime: utcGtfsTimeToLocal(frequency.endTime),
});

const mapTripDetailsToLocal = (trip: TripDetails): TripDetails => ({
  ...trip,

  stopTimes: trip.stopTimes.map(mapStopTimeToLocal),

  frequencies: trip.frequencies.map(mapFrequencyToLocal),
});

const mapStopTimesPayloadToUtc = (
  payload: ReplaceTripStopTimesPayload,
): ReplaceTripStopTimesPayload => ({
  stopTimes: payload.stopTimes.map((stopTime) => ({
    ...stopTime,

    arrivalTime: localGtfsTimeToUtc(stopTime.arrivalTime),

    departureTime: localGtfsTimeToUtc(stopTime.departureTime),
  })),
});

const mapFrequenciesPayloadToUtc = (
  payload: ReplaceTripFrequenciesPayload,
): ReplaceTripFrequenciesPayload => ({
  frequencies: payload.frequencies.map((frequency) => ({
    ...frequency,

    startTime: localGtfsTimeToUtc(frequency.startTime),

    endTime: localGtfsTimeToUtc(frequency.endTime),
  })),
});

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

    return mapTripDetailsToLocal(response.data);
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
    const utcPayload = mapStopTimesPayloadToUtc(payload);

    const response = await apiClient.put<TripStopTime[]>(
      `${getTripsEndpoint(orgId)}/${tripId}/stop-times`,
      utcPayload,
    );

    return response.data.map(mapStopTimeToLocal);
  },

  replaceFrequencies: async (
    orgId: number,
    tripId: number,
    payload: ReplaceTripFrequenciesPayload,
  ) => {
    const utcPayload = mapFrequenciesPayloadToUtc(payload);

    const response = await apiClient.put<TripFrequency[]>(
      `${getTripsEndpoint(orgId)}/${tripId}/frequencies`,
      utcPayload,
    );

    return response.data.map(mapFrequencyToLocal);
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

    return {
      ...response.data,

      departures: response.data.departures.map((departure) =>
        utcGtfsTimeToLocal(departure, date),
      ),
    };
  },
};
