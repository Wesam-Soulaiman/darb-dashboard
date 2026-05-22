import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { routesApi } from "../../api/locations/routesApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  CreateRoutePayload,
  GetRoutesParams,
  UpdateRoutePayload,
  UpdateRouteStopsPayload,
} from "../../types/route.types";

export const routesQueryKeys = {
  all: ["routes"] as const,

  lists: () => [...routesQueryKeys.all, "list"] as const,
  list: (params?: GetRoutesParams) =>
    [...routesQueryKeys.lists(), params ?? {}] as const,

  details: () => [...routesQueryKeys.all, "details"] as const,
  detail: (id: string) => [...routesQueryKeys.details(), id] as const,
};

export const useRoutes = (params?: GetRoutesParams) => {
  return useQuery({
    queryKey: routesQueryKeys.list(params),
    queryFn: () => routesApi.getAll(params),
  });
};

export const useRoute = (id?: string) => {
  return useQuery({
    queryKey: routesQueryKeys.detail(id as string),
    queryFn: () => routesApi.getById(id as string),
    enabled: Boolean(id),
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateRoutePayload) => routesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: routesQueryKeys.all,
      });

      toast.success(t("routes.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("routes.toast.createError")));
    },
  });
};

export const useUpdateRoute = (id: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateRoutePayload) => routesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: routesQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: routesQueryKeys.detail(id),
      });

      toast.success(t("routes.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("routes.toast.updateError")));
    },
  });
};

export const useUpdateRouteStops = (id: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateRouteStopsPayload) =>
      routesApi.updateStops(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: routesQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: routesQueryKeys.detail(id),
      });

      toast.success(t("routes.stops.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("routes.stops.toast.updateError")),
      );
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => routesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: routesQueryKeys.all,
      });

      toast.success(t("routes.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("routes.toast.deleteError")));
    },
  });
};
