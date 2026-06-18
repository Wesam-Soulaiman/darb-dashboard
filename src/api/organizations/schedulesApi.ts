import { apiClient } from "../apiClient";
import type {
  CreateScheduleExceptionPayload,
  CreateSchedulePayload,
  GetSchedulesParams,
  Schedule,
  ScheduleException,
  SchedulesResponse,
  UpdateSchedulePayload,
} from "../../types/schedule.types";

const getOrganizationSchedulesEndpoint = (orgId: number) =>
  `/organizations/${orgId}/schedules`;

export const schedulesApi = {
  getAll: async (orgId: number, params?: GetSchedulesParams) => {
    const response = await apiClient.get<SchedulesResponse>(
      getOrganizationSchedulesEndpoint(orgId),
      {
        params,
      },
    );

    return response.data;
  },

  getById: async (orgId: number, id: number) => {
    const response = await apiClient.get<Schedule>(
      `${getOrganizationSchedulesEndpoint(orgId)}/${id}`,
    );

    return response.data;
  },

  create: async (orgId: number, payload: CreateSchedulePayload) => {
    const response = await apiClient.post<Schedule>(
      getOrganizationSchedulesEndpoint(orgId),
      payload,
    );

    return response.data;
  },

  update: async (orgId: number, id: number, payload: UpdateSchedulePayload) => {
    const response = await apiClient.patch<Schedule>(
      `${getOrganizationSchedulesEndpoint(orgId)}/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (orgId: number, id: number) => {
    await apiClient.delete<void>(`${getOrganizationSchedulesEndpoint(orgId)}/${id}`);
  },

  getExceptions: async (orgId: number, scheduleId: number) => {
    const response = await apiClient.get<ScheduleException[]>(
      `${getOrganizationSchedulesEndpoint(orgId)}/${scheduleId}/exceptions`,
    );

    return response.data;
  },

  createException: async (
    orgId: number,
    scheduleId: number,
    payload: CreateScheduleExceptionPayload,
  ) => {
    const response = await apiClient.post<ScheduleException>(
      `${getOrganizationSchedulesEndpoint(orgId)}/${scheduleId}/exceptions`,
      payload,
    );

    return response.data;
  },

  deleteException: async (orgId: number, scheduleId: number, exceptionId: number) => {
    await apiClient.delete<void>(
      `${getOrganizationSchedulesEndpoint(
        orgId,
      )}/${scheduleId}/exceptions/${exceptionId}`,
    );
  },
};
