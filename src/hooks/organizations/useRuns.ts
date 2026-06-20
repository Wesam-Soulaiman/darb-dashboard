import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../api/apiError";
import { runsApi } from "../../api/organizations/runsApi";

import type {
  CancelRunPayload,
  GetRunsParams,
  GetRunStatsParams,
  UpdateRunPayload,
} from "../../types/run.types";

export const runsQueryKeys = {
  all: ["runs"] as const,

  org: (orgId: number) => [...runsQueryKeys.all, "organization", orgId] as const,

  lists: (orgId: number) => [...runsQueryKeys.org(orgId), "list"] as const,

  list: (orgId: number, params?: GetRunsParams) =>
    [...runsQueryKeys.lists(orgId), params ?? {}] as const,

  dailyRoot: (orgId: number) => [...runsQueryKeys.org(orgId), "daily"] as const,

  daily: (orgId: number, date: string, excludeFinished: boolean) =>
    [...runsQueryKeys.dailyRoot(orgId), date, excludeFinished] as const,

  details: (orgId: number) => [...runsQueryKeys.org(orgId), "detail"] as const,

  detail: (orgId: number, runId: number) =>
    [...runsQueryKeys.details(orgId), runId] as const,

  statsRoot: (orgId: number) => [...runsQueryKeys.org(orgId), "stats"] as const,

  stats: (orgId: number, params?: GetRunStatsParams) =>
    [...runsQueryKeys.statsRoot(orgId), params ?? {}] as const,

  locations: (orgId: number) => [...runsQueryKeys.org(orgId), "location"] as const,

  location: (orgId: number, runId: number) =>
    [...runsQueryKeys.locations(orgId), runId] as const,
};

const isValidId = (value: number): boolean => {
  return Number.isFinite(value) && value > 0;
};

export const useRuns = (orgId: number, params?: GetRunsParams, enabled = true) => {
  return useQuery({
    queryKey: runsQueryKeys.list(orgId, params),

    queryFn: () => runsApi.getAll(orgId, params),

    enabled: enabled && isValidId(orgId),
  });
};

export const useDailyRuns = (
  orgId: number,
  date: string,
  excludeFinished: boolean,
  enabled = true,
) => {
  return useQuery({
    queryKey: runsQueryKeys.daily(orgId, date, excludeFinished),

    queryFn: () =>
      runsApi.getAllPages(orgId, {
        date,
        excludeFinished,
      }),

    enabled: enabled && isValidId(orgId) && Boolean(date.trim()),
  });
};

export const useRun = (orgId: number, runId?: number, enabled = true) => {
  const normalizedRunId = Number(runId);

  return useQuery({
    queryKey: runsQueryKeys.detail(orgId, normalizedRunId),

    queryFn: () => runsApi.getById(orgId, normalizedRunId),

    enabled: enabled && isValidId(orgId) && isValidId(normalizedRunId),
  });
};

export const useCreateTodayRuns = (orgId: number) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: (routeId: string) =>
      runsApi.createForDate(orgId, {
        routeId,
        date: dayjs().format("YYYY-MM-DD"),
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: runsQueryKeys.org(orgId),
      });

      toast.success(t("runs.toast.createSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("runs.toast.createError")));
    },
  });
};

export const useUpdateRun = (orgId: number, runId: number) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateRunPayload) => runsApi.update(orgId, runId, payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.lists(orgId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.dailyRoot(orgId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.detail(orgId, runId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.statsRoot(orgId),
        }),
      ]);

      toast.success(t("runs.toast.updateSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("runs.toast.updateError")));
    },
  });
};

export const useConfirmRun = (orgId: number, runId: number) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => runsApi.confirm(orgId, runId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.lists(orgId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.dailyRoot(orgId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.detail(orgId, runId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.statsRoot(orgId),
        }),
      ]);

      toast.success(t("runs.toast.confirmSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("runs.toast.confirmError")));
    },
  });
};

export const useCancelRun = (orgId: number, runId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CancelRunPayload) => runsApi.cancel(orgId, runId, payload),

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: runsQueryKeys.location(orgId, runId),
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.lists(orgId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.dailyRoot(orgId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.detail(orgId, runId),
        }),

        queryClient.invalidateQueries({
          queryKey: runsQueryKeys.statsRoot(orgId),
        }),
      ]);

      toast.success(t("runs.toast.cancelSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("runs.toast.cancelError")));
    },
  });
};

export const useRunStats = (
  orgId: number,
  params?: GetRunStatsParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: runsQueryKeys.stats(orgId, params),

    queryFn: () => runsApi.getStats(orgId, params),

    enabled: enabled && isValidId(orgId),
  });
};

export const useRunLocation = (orgId: number, runId?: number, enabled = true) => {
  const normalizedRunId = Number(runId);

  return useQuery({
    queryKey: runsQueryKeys.location(orgId, normalizedRunId),

    queryFn: () => runsApi.getLocation(orgId, normalizedRunId),

    enabled: enabled && isValidId(orgId) && isValidId(normalizedRunId),

    retry: false,
    refetchOnWindowFocus: false,
  });
};
