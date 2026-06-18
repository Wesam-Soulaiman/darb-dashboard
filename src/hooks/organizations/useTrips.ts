import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../api/apiError";
import { tripsApi } from "../../api/organizations/tripsApi";

import type {
  CreateTripPayload,
  GetTripsParams,
  ReplaceTripFrequenciesPayload,
  ReplaceTripStopTimesPayload,
  UpdateTripPayload,
} from "../../types/trip.types";

export const tripsQueryKeys = {
  all: ["trips"] as const,

  org: (orgId: number) => [...tripsQueryKeys.all, "organization", orgId] as const,

  lists: (orgId: number) => [...tripsQueryKeys.org(orgId), "list"] as const,

  list: (orgId: number, params?: GetTripsParams) =>
    [...tripsQueryKeys.lists(orgId), params ?? {}] as const,

  details: (orgId: number) => [...tripsQueryKeys.org(orgId), "details"] as const,

  detail: (orgId: number, tripId: number) =>
    [...tripsQueryKeys.details(orgId), tripId] as const,

  preview: (orgId: number, tripId: number, date: string) =>
    [...tripsQueryKeys.detail(orgId, tripId), "preview", date] as const,
};

const isValidId = (value: number) => Number.isFinite(value) && value > 0;

export const useTrips = (orgId: number, params?: GetTripsParams) => {
  return useQuery({
    queryKey: tripsQueryKeys.list(orgId, params),
    queryFn: () => tripsApi.getAll(orgId, params),
    enabled: isValidId(orgId),
  });
};

export const useTrip = (orgId: number, tripId?: number, enabled = true) => {
  return useQuery({
    queryKey: tripsQueryKeys.detail(orgId, tripId as number),
    queryFn: () => tripsApi.getById(orgId, tripId as number),
    enabled: enabled && isValidId(orgId) && isValidId(Number(tripId)),
  });
};

export const useCreateTrip = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateTripPayload) => tripsApi.create(orgId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.org(orgId),
      });

      toast.success(t("trips.toast.createSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("trips.toast.createError")));
    },
  });
};

export const useUpdateTrip = (orgId: number, tripId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateTripPayload) => tripsApi.update(orgId, tripId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.org(orgId),
      });

      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.detail(orgId, tripId),
      });

      toast.success(t("trips.toast.updateSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("trips.toast.updateError")));
    },
  });
};

export const useDeleteTrip = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (tripId: number) => tripsApi.delete(orgId, tripId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.org(orgId),
      });

      toast.success(t("trips.toast.deleteSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("trips.toast.deleteError")));
    },
  });
};

export const useReplaceTripStopTimes = (orgId: number, tripId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ReplaceTripStopTimesPayload) =>
      tripsApi.replaceStopTimes(orgId, tripId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.org(orgId),
      });

      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.detail(orgId, tripId),
      });

      toast.success(t("trips.stopTimes.toast.updateSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("trips.stopTimes.toast.updateError")));
    },
  });
};

export const useReplaceTripFrequencies = (orgId: number, tripId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ReplaceTripFrequenciesPayload) =>
      tripsApi.replaceFrequencies(orgId, tripId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.org(orgId),
      });

      queryClient.invalidateQueries({
        queryKey: tripsQueryKeys.detail(orgId, tripId),
      });

      toast.success(t("trips.frequencies.toast.updateSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("trips.frequencies.toast.updateError")));
    },
  });
};

export const useTripPreviewTimes = (
  orgId: number,
  tripId: number,
  date: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: tripsQueryKeys.preview(orgId, tripId, date),

    queryFn: () => tripsApi.previewTimes(orgId, tripId, date),

    enabled: enabled && isValidId(orgId) && isValidId(tripId) && Boolean(date.trim()),
  });
};
