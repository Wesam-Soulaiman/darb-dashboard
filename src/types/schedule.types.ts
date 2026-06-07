import type { PagePaginatedResponse } from "./user.types";

export type ScheduleExceptionType = 1 | 2;

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
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleException {
  id: number;
  exceptionDate: string;
  exceptionType: ScheduleExceptionType;
  note?: string | null;
  createdAt: string;
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
