import { useMutation } from "@tanstack/react-query";

import { authApi, type ForgotPasswordPayload } from "../../api/auth/authApi";

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}
