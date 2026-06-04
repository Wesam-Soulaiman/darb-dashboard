import type { PagePaginatedResponse } from "./user.types";

export type BusType = "STANDARD" | "MINIBUS" | "ARTICULATED";

export type BusStatus =
  | "AVAILABLE"
  | "IN_SERVICE"
  | "MAINTENANCE"
  | "OUT_OF_SERVICE";

export interface Bus {
  id: number;
  busCode: string;
  plateNumber: string;
  type: BusType;
  capacity: number;
  manufacturer: string;
  model: string;
  year: number;
  status: BusStatus;
  lastMaintenanceDate?: string | null;
  nextMaintenanceDate?: string | null;
  registrationExpiry: string;
  organizationId: number;
  createdAt: string;
}

export type BusesResponse = PagePaginatedResponse<Bus>;

export interface GetBusesParams {
  page?: number;
  limit?: number;
  status?: BusStatus;
  type?: BusType;
  search?: string;
}

export interface CreateBusPayload {
  plateNumber: string;
  type: BusType;
  capacity: number;
  manufacturer: string;
  model: string;
  year: number;
  registrationExpiry: string;
}

export interface UpdateBusPayload {
  plateNumber?: string;
  type?: BusType;
  capacity?: number;
  manufacturer?: string;
  model?: string;
  year?: number;
  registrationExpiry?: string;
  status?: BusStatus;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}
