import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { organizationsApi } from "../../api/organizations/organizationsApi";
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  AssignOrganizationRoutePayload,
  RemoveOrganizationRoutePayload,
} from "../../types/organization.types";
import { getApiErrorMessage } from "../../api/apiError";

export const organizationsQueryKeys = {
  all: ["organizations"] as const,
  details: () => [...organizationsQueryKeys.all, "details"] as const,
  detail: (id: number) => [...organizationsQueryKeys.details(), id] as const,
};

export const useOrganizations = () => {
  return useQuery({
    queryKey: organizationsQueryKeys.all,
    queryFn: organizationsApi.getAll,
  });
};

export const useOrganization = (id: number) => {
  return useQuery({
    queryKey: organizationsQueryKeys.detail(id),
    queryFn: () => organizationsApi.getById(id),
    enabled: Number.isFinite(id),
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      organizationsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.all,
      });

      toast.success(t("organizations.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("organizations.toast.createError")),
      );
    },
  });
};

export const useUpdateOrganization = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) =>
      organizationsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.detail(id),
      });

      toast.success(t("organizations.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("organizations.toast.updateError")),
      );
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => organizationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.all,
      });

      toast.success(t("organizations.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("organizations.toast.deleteError")),
      );
    },
  });
};

export const useAssignOrganizationRoute = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: AssignOrganizationRoutePayload) =>
      organizationsApi.assignRoute(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.detail(id),
      });

      toast.success(t("organizations.routes.toast.assignSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("organizations.routes.toast.assignError")),
      );
    },
  });
};

export const useRemoveOrganizationRoute = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: RemoveOrganizationRoutePayload) =>
      organizationsApi.removeRoute(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.detail(id),
      });

      toast.success(t("organizations.routes.toast.removeSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("organizations.routes.toast.removeError")),
      );
    },
  });
};
