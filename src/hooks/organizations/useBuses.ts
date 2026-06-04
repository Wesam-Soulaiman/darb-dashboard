import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { busesApi } from "../../api/organizations/busesApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  CreateBusPayload,
  GetBusesParams,
  UpdateBusPayload,
} from "../../types/bus.types";

export const busesQueryKeys = {
  all: ["buses"] as const,

  org: (orgId: number) =>
    [...busesQueryKeys.all, "organization", orgId] as const,

  lists: (orgId: number) => [...busesQueryKeys.org(orgId), "list"] as const,
  list: (orgId: number, params?: GetBusesParams) =>
    [...busesQueryKeys.lists(orgId), params ?? {}] as const,

  details: (orgId: number) =>
    [...busesQueryKeys.org(orgId), "details"] as const,
  detail: (orgId: number, id: number) =>
    [...busesQueryKeys.details(orgId), id] as const,
};

export const useBuses = (orgId: number, params?: GetBusesParams) => {
  return useQuery({
    queryKey: busesQueryKeys.list(orgId, params),
    queryFn: () => busesApi.getAll(orgId, params),
    enabled: Number.isFinite(orgId) && orgId > 0,
  });
};

export const useBus = (orgId: number, id?: number) => {
  return useQuery({
    queryKey: busesQueryKeys.detail(orgId, id as number),
    queryFn: () => busesApi.getById(orgId, id as number),
    enabled: Number.isFinite(orgId) && orgId > 0 && Boolean(id),
  });
};

export const useCreateBus = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateBusPayload) => busesApi.create(orgId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: busesQueryKeys.org(orgId),
      });

      toast.success(t("buses.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("buses.toast.createError")));
    },
  });
};

export const useUpdateBus = (orgId: number, id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateBusPayload) =>
      busesApi.update(orgId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: busesQueryKeys.org(orgId),
      });

      queryClient.invalidateQueries({
        queryKey: busesQueryKeys.detail(orgId, id),
      });

      toast.success(t("buses.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("buses.toast.updateError")));
    },
  });
};

export const useDeleteBus = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => busesApi.delete(orgId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: busesQueryKeys.org(orgId),
      });

      toast.success(t("buses.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("buses.toast.deleteError")));
    },
  });
};
