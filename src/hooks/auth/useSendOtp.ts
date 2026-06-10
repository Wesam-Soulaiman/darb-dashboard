import { useMutation } from "@tanstack/react-query";

import { authApi } from "../../api/auth/authApi";
import type { SendOtpPayload } from "../../types/auth.types";

export function useSendOtp() {
  return useMutation({
    mutationKey: ["auth", "send-otp"],
    mutationFn: (payload: SendOtpPayload) => authApi.sendOtp(payload),
  });
}
