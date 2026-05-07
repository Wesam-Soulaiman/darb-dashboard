import { useMutation } from "@tanstack/react-query";

import { authApi, type SendOtpPayload } from "../../api/auth/authApi";

export function useSendOtp() {
  return useMutation({
    mutationKey: ["auth", "send-otp"],
    mutationFn: (payload: SendOtpPayload) => authApi.sendOtp(payload),
  });
}
