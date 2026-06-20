import type { PagePaginatedResponse } from "./user.types";

export type RunStatus = "draft" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface RunTripRef {
  id: number;
  routeId: string;
  headsign: string;
}

export interface RunDriverRef {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface RunBusRef {
  id: number;
  busCode: string;
  plateNumber: string;
}

export interface Run {
  id: number;
  organizationId: number;
  operatingDate: string;
  operatingTime: string;
  status: RunStatus;
  trip: RunTripRef;
  driver: RunDriverRef | null;
  bus: RunBusRef | null;
  createdAt: string;
  updatedAt: string;
}

export type RunsResponse = PagePaginatedResponse<Run>;

export interface GetRunsParams {
  page?: number;
  limit?: number;
  tripId?: number;
  scheduleId?: number;
  driverId?: number;
  routeId?: string;
  excludeFinished?: boolean;
  busId?: number;
  status?: RunStatus;
  date?: string;
  fromDate?: string;
  toDate?: string;
}

export type GetAllRunPagesParams = Omit<GetRunsParams, "page" | "limit">;

export interface CreateRunsForDatePayload {
  date: string;
  routeId: string;
}

export type CreateRunsForDateResponse = RunsResponse;

export interface UpdateRunPayload {
  driverId: number;
  busId: number;
}

export interface GetRunStatsParams {
  fromDate?: string;
  toDate?: string;
}

export interface RunStats {
  total: number;
  byStatus: Record<RunStatus, number>;
}

export interface RunLocationCoordinates {
  type: "Point";
  coordinates: [number, number];
}

export interface RunLocation {
  id: string;
  coordinates: RunLocationCoordinates;
  velocity: number;
  runId: number;
  timestamp: string;
}

export interface CancelRunPayload {
  reason: string;
}
