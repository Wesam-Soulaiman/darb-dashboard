import type { PagePaginatedResponse } from "./user.types";

export type TripCalendarStatus = "allowed" | "forced" | "blocked" | "inactive";

export type TripDirectionId = 0;

export type GtfsPickupDropOffType = 0 | 1 | 2 | 3;

export type GtfsTimepoint = 0 | 1;

export interface TripRouteRef {
  id: string;
  name: string;
}

export interface TripScheduleRef {
  id: number;
  name: string;
  serviceCode: string;
}

export interface TripBusRef {
  id: number;
  busCode: string;
  plateNumber: string;
}

export interface TripStopTime {
  id: number;
  stopId: string;
  stopSequence: number;
  arrivalTime: string;
  departureTime: string;
  pickupType: GtfsPickupDropOffType;
  dropOffType: GtfsPickupDropOffType;
  timepoint: GtfsTimepoint;
}

export interface TripFrequency {
  id: number;
  startTime: string;
  endTime: string;
  headwaySecs: number;
  exactTimes: boolean;
}

export interface TripDriverRef {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Trip {
  id: number;
  organizationId: number;

  route: TripRouteRef;
  schedule: TripScheduleRef;

  headsign: string;
  directionId: TripDirectionId;

  defaultBus?: TripBusRef;
  defaultDriver: TripDriverRef;
  blockId?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface TripDetails extends Trip {
  stopTimes: TripStopTime[];
  frequencies: TripFrequency[];
}

export type TripsResponse = PagePaginatedResponse<Trip>;

export interface GetTripsParams {
  page?: number;
  limit?: number;
  routeId?: string;
  scheduleId?: number;
  isActive?: boolean;
  search?: string;
}

export interface CreateTripPayload {
  routeId: string;
  scheduleId: number;
  headsign: string;
  defaultDriverId: number;
  directionId: TripDirectionId;
  defaultBusId: number;
  blockId?: string;
  isActive: boolean;
}

export type UpdateTripPayload = CreateTripPayload;

export interface ReplaceTripStopTimesPayload {
  stopTimes: Array<{
    stopId: string;
    stopSequence: number;
    arrivalTime: string;
    departureTime: string;
    pickupType: GtfsPickupDropOffType;
    dropOffType: GtfsPickupDropOffType;
    timepoint: GtfsTimepoint;
  }>;
}

export interface ReplaceTripFrequenciesPayload {
  frequencies: Array<{
    startTime: string;
    endTime: string;
    headwaySecs: number;
    exactTimes: boolean;
  }>;
}

export interface TripPreviewTimesResponse {
  status: TripCalendarStatus;
  departures: string[];
}
