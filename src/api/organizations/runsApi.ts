import { apiClient } from "../apiClient";

import { utcGtfsTimeToLocal } from "../../utils/gtfsTimeZone";

import type {
  CancelRunPayload,
  CreateRunsForDatePayload,
  CreateRunsForDateResponse,
  GetAllRunPagesParams,
  GetRunsParams,
  GetRunStatsParams,
  Run,
  RunLocation,
  RunsResponse,
  RunStats,
  UpdateRunPayload,
} from "../../types/run.types";

const RUNS_PAGE_SIZE = 100;

const getRunsEndpoint = (orgId: number) => `/organizations/${orgId}/runs`;

const mapRunToLocalTime = (run: Run): Run => ({
  ...run,

  operatingTime: utcGtfsTimeToLocal(run.operatingTime, run.operatingDate),
});

const mapRunsResponseToLocalTime = (response: RunsResponse): RunsResponse => ({
  ...response,

  data: response.data.map(mapRunToLocalTime),
});

const getRuns = async (orgId: number, params?: GetRunsParams): Promise<RunsResponse> => {
  const response = await apiClient.get<RunsResponse>(getRunsEndpoint(orgId), {
    params,
  });

  return mapRunsResponseToLocalTime(response.data);
};

const getAllRunPages = async (
  orgId: number,
  params?: GetAllRunPagesParams,
): Promise<Run[]> => {
  const firstPage = await getRuns(orgId, {
    ...params,
    page: 1,
    limit: RUNS_PAGE_SIZE,
  });

  const allRuns = [...firstPage.data];

  const totalPages = Math.max(1, firstPage.meta.totalPages);

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await getRuns(orgId, {
      ...params,
      page,
      limit: RUNS_PAGE_SIZE,
    });

    allRuns.push(...response.data);
  }

  return allRuns;
};

export const runsApi = {
  getAll: getRuns,

  getAllPages: getAllRunPages,

  getById: async (orgId: number, runId: number): Promise<Run> => {
    const response = await apiClient.get<Run>(`${getRunsEndpoint(orgId)}/${runId}`);

    return mapRunToLocalTime(response.data);
  },

  createForDate: async (
    orgId: number,
    payload: CreateRunsForDatePayload,
  ): Promise<CreateRunsForDateResponse> => {
    const response = await apiClient.post<CreateRunsForDateResponse>(
      `${getRunsEndpoint(orgId)}/create-for-date`,
      payload,
    );

    return mapRunsResponseToLocalTime(response.data);
  },

  update: async (
    orgId: number,
    runId: number,
    payload: UpdateRunPayload,
  ): Promise<Run> => {
    const response = await apiClient.patch<Run>(
      `${getRunsEndpoint(orgId)}/${runId}`,
      payload,
    );

    return mapRunToLocalTime(response.data);
  },

  confirm: async (orgId: number, runId: number): Promise<Run> => {
    const response = await apiClient.post<Run>(
      `${getRunsEndpoint(orgId)}/${runId}/confirm`,
    );

    return mapRunToLocalTime(response.data);
  },

  cancel: async (
    orgId: number,
    runId: number,
    payload: CancelRunPayload,
  ): Promise<Run> => {
    const response = await apiClient.post<Run>(
      `${getRunsEndpoint(orgId)}/${runId}/cancel`,
      payload,
    );

    return response.data;
  },

  getStats: async (orgId: number, params?: GetRunStatsParams): Promise<RunStats> => {
    const response = await apiClient.get<RunStats>(`${getRunsEndpoint(orgId)}/stats`, {
      params,
    });

    return response.data;
  },

  getLocation: async (orgId: number, runId: number): Promise<RunLocation> => {
    const response = await apiClient.get<RunLocation>(
      `${getRunsEndpoint(orgId)}/${runId}/location`,
    );

    return response.data;
  },
};
