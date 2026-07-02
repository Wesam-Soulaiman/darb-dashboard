import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { schedulesApi } from "../../api/organizations/schedulesApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  CreateScheduleExceptionPayload,
  CreateSchedulePayload,
  GetSchedulesParams,
  UpdateSchedulePayload,
} from "../../types/schedule.types";

export const schedulesQueryKeys = {
  all: ["schedules"] as const,

  org: (orgId: number) => [...schedulesQueryKeys.all, "organization", orgId] as const,

  lists: (orgId: number) => [...schedulesQueryKeys.org(orgId), "list"] as const,
  list: (orgId: number, params?: GetSchedulesParams) =>
    [...schedulesQueryKeys.lists(orgId), params ?? {}] as const,

  details: (orgId: number) => [...schedulesQueryKeys.org(orgId), "details"] as const,
  detail: (orgId: number, id: number) =>
    [...schedulesQueryKeys.details(orgId), id] as const,

  exceptions: (orgId: number, scheduleId: number) =>
    [...schedulesQueryKeys.detail(orgId, scheduleId), "exceptions"] as const,
};

export const useSchedules = (orgId: number, params?: GetSchedulesParams) => {
  return useQuery({
    queryKey: schedulesQueryKeys.list(orgId, params),
    queryFn: () => schedulesApi.getAll(orgId, params),
    enabled: Number.isFinite(orgId) && orgId > 0,
  });
};

export const useSchedule = (orgId: number, id?: number) => {
  return useQuery({
    queryKey: schedulesQueryKeys.detail(orgId, id as number),
    queryFn: () => schedulesApi.getById(orgId, id as number),
    enabled: Number.isFinite(orgId) && orgId > 0 && Boolean(id),
  });
};

export const useCreateSchedule = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) => schedulesApi.create(orgId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.org(orgId),
      });

      toast.success(t("schedules.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("schedules.toast.createError")));
    },
  });
};

export const useUpdateSchedule = (orgId: number, id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateSchedulePayload) =>
      schedulesApi.update(orgId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.org(orgId),
      });

      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.detail(orgId, id),
      });

      toast.success(t("schedules.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("schedules.toast.updateError")));
    },
  });
};

export const useDeleteSchedule = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => schedulesApi.delete(orgId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.org(orgId),
      });

      toast.success(t("schedules.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("schedules.toast.deleteError")));
    },
  });
};

export const useScheduleExceptions = (
  orgId: number,
  scheduleId: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: schedulesQueryKeys.exceptions(orgId, scheduleId),
    queryFn: () => schedulesApi.getExceptions(orgId, scheduleId),
    enabled:
      enabled &&
      Number.isFinite(orgId) &&
      orgId > 0 &&
      Number.isFinite(scheduleId) &&
      scheduleId > 0,
  });
};

export const useCreateScheduleException = (orgId: number, scheduleId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateScheduleExceptionPayload) =>
      schedulesApi.createException(orgId, scheduleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.exceptions(orgId, scheduleId),
      });

      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.org(orgId),
      });

      toast.success(t("schedules.exceptions.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("schedules.exceptions.toast.createError")));
    },
  });
};

export const useDeleteScheduleException = (orgId: number, scheduleId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (exceptionId: number) =>
      schedulesApi.deleteException(orgId, scheduleId, exceptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.exceptions(orgId, scheduleId),
      });

      queryClient.invalidateQueries({
        queryKey: schedulesQueryKeys.org(orgId),
      });

      toast.success(t("schedules.exceptions.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("schedules.exceptions.toast.deleteError")));
    },
  });
};
