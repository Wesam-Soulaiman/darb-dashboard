import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { rolesApi } from "../../api/roles/rolesApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  CreateRolePayload,
  GetRolesParams,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
} from "../../types/role.types";

export const rolesQueryKeys = {
  all: ["roles"] as const,
  lists: () => [...rolesQueryKeys.all, "list"] as const,
  list: (params?: GetRolesParams) =>
    [...rolesQueryKeys.lists(), params ?? {}] as const,
};

export const useRoles = (params?: GetRolesParams) => {
  return useQuery({
    queryKey: rolesQueryKeys.list(params),
    queryFn: () => rolesApi.getAll(params),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => rolesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesQueryKeys.all,
      });

      toast.success(t("roles.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("roles.toast.createError")));
    },
  });
};

export const useUpdateRole = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateRolePayload) => rolesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesQueryKeys.all,
      });

      toast.success(t("roles.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("roles.toast.updateError")));
    },
  });
};

export const useAssignRolePermissions = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateRolePermissionsPayload) =>
      rolesApi.assignPermissions(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesQueryKeys.all,
      });

      toast.success(t("roles.toast.permissionsUpdateSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("roles.toast.permissionsUpdateError")),
      );
    },
  });
};

export const useRemoveRolePermissions = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateRolePermissionsPayload) =>
      rolesApi.removePermissions(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesQueryKeys.all,
      });

      toast.success(t("roles.toast.permissionsUpdateSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("roles.toast.permissionsUpdateError")),
      );
    },
  });
};
