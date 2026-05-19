import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { usersApi } from "../../api/users/usersApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  CreateUserPayload,
  GetUsersParams,
  UpdateMyProfilePayload,
  UpdateUserPayload,
} from "../../types/user.types";

export const usersQueryKeys = {
  all: ["users"] as const,

  lists: () => [...usersQueryKeys.all, "list"] as const,
  list: (params?: GetUsersParams) =>
    [...usersQueryKeys.lists(), params ?? {}] as const,

  details: () => [...usersQueryKeys.all, "details"] as const,
  detail: (id: number) => [...usersQueryKeys.details(), id] as const,

  organizationLists: () =>
    [...usersQueryKeys.all, "organization-list"] as const,
  organizationList: (orgId: number, params?: GetUsersParams) =>
    [...usersQueryKeys.organizationLists(), orgId, params ?? {}] as const,

  me: () => [...usersQueryKeys.all, "me"] as const,
};

export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => usersApi.getAll(params),
  });
};

export const useUser = (id?: number) => {
  return useQuery({
    queryKey: usersQueryKeys.detail(id as number),
    queryFn: () => usersApi.getById(id as number),
    enabled: Boolean(id),
  });
};

export const useOrganizationUsers = (
  orgId?: number,
  params?: GetUsersParams,
) => {
  return useQuery({
    queryKey: usersQueryKeys.organizationList(orgId as number, params),
    queryFn: () => usersApi.getOrganizationUsers(orgId as number, params),
    enabled: Boolean(orgId),
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: usersQueryKeys.me(),
    queryFn: usersApi.getMe,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      toast.success(t("users.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("users.toast.createError")));
    },
  });
};

export const useCreateOrganizationUser = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      usersApi.createOrganizationUser(orgId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      toast.success(t("users.toast.createSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("users.toast.createError")));
    },
  });
};

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.detail(id),
      });

      toast.success(t("users.toast.updateSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("users.toast.updateError")));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      toast.success(t("users.toast.deleteSuccess"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("users.toast.deleteError")));
    },
  });
};

export const useRemoveUserFromOrganization = (orgId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => usersApi.removeFromOrganization(orgId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      toast.success(t("users.toast.removeFromOrganizationSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("users.toast.removeFromOrganizationError")),
      );
    },
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateMyProfilePayload) =>
      usersApi.updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.me(),
      });

      toast.success(t("users.toast.profileUpdateSuccess"));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t("users.toast.profileUpdateError")),
      );
    },
  });
};
