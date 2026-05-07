import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage, getApiStatusCode } from "../../api/apiError";
import { saveAuthSession } from "../../core/auth/authStorage";
import { authApi, type SignInPayload } from "../../api/auth/authApi";
import { useAuthContext } from "../../contexts/AuthContext";

type LocationState = {
  from?: string;
};

export function useSignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthUser } = useAuthContext();

  return useMutation({
    mutationKey: ["auth", "signin"],

    mutationFn: (payload: SignInPayload) => authApi.signIn(payload),

    onSuccess: (data) => {
      saveAuthSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      setAuthUser(data.user);

      toast.success(t("auth.login.success"));

      const state = location.state as LocationState | null;
      const redirectTo = state?.from || "/admin/dashboard";

      navigate(redirectTo, { replace: true });
    },

    onError: (error) => {
      const status = getApiStatusCode(error);

      if (status === 400) {
        toast.error(t("auth.login.invalidCredentials"));
        return;
      }

      if (status === 403) {
        toast.error(t("auth.login.accountNotActivated"));
        return;
      }

      toast.error(getApiErrorMessage(error, t("api.unexpectedError")));
    },
  });
}
