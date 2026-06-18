import { requestData } from "../apiClient";
import type {
  ChangeMyPasswordPayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  RawAuthResponse,
  SendOtpPayload,
  SignInPayload,
  SignInResponse,
} from "../../types/auth.types";

export function normalizeAuthResponse(response: RawAuthResponse): SignInResponse {
  const payload = response.data ?? response;
  const accessToken = payload.accessToken ?? payload.access_token ?? payload.token;
  const refreshToken = payload.refreshToken ?? payload.refresh_token;
  const user = payload.user;

  if (!accessToken || !refreshToken || !user) {
    throw new Error(
      "Invalid sign-in response: access token, refresh token, or user is missing.",
    );
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export const authApi = {
  async signIn(payload: SignInPayload) {
    const response = await requestData<RawAuthResponse, SignInPayload>({
      url: "/auth/signin",
      method: "POST",
      data: payload,
      skipAuth: true,
      skipRefresh: true,
    });

    return normalizeAuthResponse(response);
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return requestData<void, ForgotPasswordPayload>({
      url: "/auth/forgot-password",
      method: "POST",
      data: payload,
      skipAuth: true,
      skipRefresh: true,
    });
  },

  sendOtp(payload: SendOtpPayload) {
    return requestData<void, SendOtpPayload>({
      url: "/auth/send-otp",
      method: "POST",
      data: payload,
      skipAuth: true,
      skipRefresh: true,
    });
  },

  changePassword(payload: ChangePasswordPayload) {
    return requestData<void, ChangePasswordPayload>({
      url: "/auth/change-password",
      method: "POST",
      data: payload,
      skipAuth: true,
      skipRefresh: true,
    });
  },

  changeMyPassword(payload: ChangeMyPasswordPayload) {
    return requestData<void, ChangeMyPasswordPayload>({
      url: "/auth/me/change-password",
      method: "POST",
      data: payload,
    });
  },
};
