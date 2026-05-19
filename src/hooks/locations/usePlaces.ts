import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { placesApi } from "../../api/locations/placesApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  CreatePlacePayload,
  GetPlacesParams,
  UpdatePlacePayload,
} from "../../types/place.types";

export const placesQueryKeys = {
  all: ["places"] as const,

  lists: () => [...placesQueryKeys.all, "list"] as const,
  list: (params?: GetPlacesParams) =>
    [...placesQueryKeys.lists(), params ?? {}] as const,

  details: () => [...placesQueryKeys.all, "details"] as const,
  detail: (id: number) => [...placesQueryKeys.details(), id] as const,
};

export const usePlaces = (params?: GetPlacesParams) => {
  return useQuery({
    queryKey: placesQueryKeys.list(params),
    queryFn: () => placesApi.getAll(params),
  });
};

export const usePlace = (id?: number) => {
  return useQuery({
    queryKey: placesQueryKeys.detail(id as number),
    queryFn: () => placesApi.getById(id as number),
    enabled: Boolean(id),
  });
};

export const useCreatePlace = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreatePlacePayload) => placesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: placesQueryKeys.all,
      });

      toast.success(t("places.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("places.toast.createError")));
    },
  });
};

export const useUpdatePlace = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdatePlacePayload) => placesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: placesQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: placesQueryKeys.detail(id),
      });

      toast.success(t("places.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("places.toast.updateError")));
    },
  });
};

export const useDeletePlace = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => placesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: placesQueryKeys.all,
      });

      toast.success(t("places.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("places.toast.deleteError")));
    },
  });
};
