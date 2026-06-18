import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { authApi } from "../../api/auth/authApi";
import { getApiErrorMessage } from "../../api/apiError";
import { usersQueryKeys } from "../users/useUsers";
import type { ChangeMyPasswordPayload } from "../../types/auth.types";

export const useChangeMyPassword = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ChangeMyPasswordPayload) => authApi.changeMyPassword(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryKeys.me(),
      });

      toast.success(t("auth.changePassword.toast.success"));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("auth.changePassword.toast.error")));
    },
  });
};
