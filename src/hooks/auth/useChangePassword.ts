import { useMutation } from "@tanstack/react-query";

import { authApi } from "../../api/auth/authApi";
import type { ChangePasswordPayload } from "../../types/auth.types";

export function useChangePassword() {
  return useMutation({
    mutationKey: ["auth", "change-password"],
    mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
  });
}
