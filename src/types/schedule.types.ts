import type { PagePaginatedResponse } from "./user.types";

export type ScheduleExceptionType = 1 | 2;

export interface ScheduleException {
  id: number;
  exceptionDate: string | null;
  exceptionType: ScheduleExceptionType;
  note?: string | null;
  createdAt: string | null;
}

export interface Schedule {
  id: number;
  organizationId: number;
  name: string;
  serviceCode: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  color: string | null;
  startDate: string | null;
  endDate: string | null;
  exceptions?: ScheduleException[];
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export type SchedulesResponse = PagePaginatedResponse<Schedule>;

export interface GetSchedulesParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

export interface CreateSchedulePayload {
  name: string;
  serviceCode: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  color: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type UpdateSchedulePayload = CreateSchedulePayload;

export interface CreateScheduleExceptionPayload {
  exceptionDate: string;
  exceptionType: ScheduleExceptionType;
  note?: string;
}
