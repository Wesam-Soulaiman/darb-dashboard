import { useMutation } from "@tanstack/react-query";

import { authApi, type ChangePasswordPayload } from "../../api/auth/authApi";

export function useChangePassword() {
  return useMutation({
    mutationKey: ["auth", "change-password"],
    mutationFn: (payload: ChangePasswordPayload) =>
      authApi.changePassword(payload),
  });
}
