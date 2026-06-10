import { useMutation } from "@tanstack/react-query";

import { authApi } from "../../api/auth/authApi";
import type { ForgotPasswordPayload } from "../../types/auth.types";

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}
