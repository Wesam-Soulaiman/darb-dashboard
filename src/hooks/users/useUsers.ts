import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { usersApi } from "../../api/users/usersApi";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  AssignUserRolePayload,
  CreateUserPayload,
  GetUsersParams,
  UnassignUserRolePayload,
  UpdateMyProfilePayload,
  UpdateOperationalProfilePayload,
  UpdateUserPayload,
} from "../../types/user.types";

export const usersQueryKeys = {
  all: ["users"] as const,

  lists: () => [...usersQueryKeys.all, "list"] as const,

  list: (params?: GetUsersParams) =>
    [...usersQueryKeys.lists(), params ?? {}] as const,

  details: () => [...usersQueryKeys.all, "details"] as const,

  detail: (id: number) => [...usersQueryKeys.details(), id] as const,

  me: () => [...usersQueryKeys.all, "me"] as const,
};

export const useUsers = (params?: GetUsersParams, enabled = true) => {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => usersApi.getAll(params),
    enabled,
  });
};

export const useUser = (id?: number) => {
  return useQuery({
    queryKey: usersQueryKeys.detail(id as number),
    queryFn: () => usersApi.getById(id as number),
    enabled: Boolean(id),
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

export const useAssignUserRole = (userId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: AssignUserRolePayload) =>
      usersApi.assignRole(userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.detail(userId),
      });

      toast.success(t("users.toast.roleUpdateSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("users.toast.roleUpdateError")));
    },
  });
};

export const useUnassignUserRole = (userId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UnassignUserRolePayload) =>
      usersApi.unassignRole(userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.detail(userId),
      });

      toast.success(t("users.toast.roleRemoveSuccess"));
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("users.toast.roleRemoveError")));
    },
  });
};

export const useUpdateOperationalProfile = (userId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateOperationalProfilePayload) =>
      usersApi.updateOperationalProfile(userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.detail(userId),
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
