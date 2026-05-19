import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { stopsApi } from "../../api/locations/stopsApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  CreateStopPayload,
  GetStopsParams,
  UpdateStopPayload,
} from "../../types/stop.types";

export const stopsQueryKeys = {
  all: ["stops"] as const,

  lists: () => [...stopsQueryKeys.all, "list"] as const,
  list: (params?: GetStopsParams) =>
    [...stopsQueryKeys.lists(), params ?? {}] as const,

  details: () => [...stopsQueryKeys.all, "details"] as const,
  detail: (id: string) => [...stopsQueryKeys.details(), id] as const,
};

export const useStops = (params?: GetStopsParams) => {
  return useQuery({
    queryKey: stopsQueryKeys.list(params),
    queryFn: () => stopsApi.getAll(params),
  });
};

export const useStop = (id?: string) => {
  return useQuery({
    queryKey: stopsQueryKeys.detail(id as string),
    queryFn: () => stopsApi.getById(id as string),
    enabled: Boolean(id),
  });
};

export const useCreateStop = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateStopPayload) => stopsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stopsQueryKeys.all,
      });

      toast.success(t("stops.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("stops.toast.createError")));
    },
  });
};

export const useUpdateStop = (id: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateStopPayload) => stopsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stopsQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: stopsQueryKeys.detail(id),
      });

      toast.success(t("stops.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("stops.toast.updateError")));
    },
  });
};

export const useDeleteStop = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => stopsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stopsQueryKeys.all,
      });

      toast.success(t("stops.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("stops.toast.deleteError")));
    },
  });
};
