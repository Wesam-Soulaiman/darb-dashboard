import { requestData } from "../apiClient";
import type { AuthUser } from "../../core/auth/authStorage";

export type SignInPayload = {
  phone: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type RawAuthResponse = Partial<SignInResponse> & {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  user?: AuthUser;
  data?: Partial<SignInResponse> & {
    access_token?: string;
    refresh_token?: string;
    token?: string;
    user?: AuthUser;
  };
};

export type ForgotPasswordPayload = {
  phone: string;
};

export type SendOtpPayload = {
  phone: string;
};

export type ChangePasswordPayload = {
  phone: string;
  otp: string;
  newPassword: string;
};

export type RefreshPayload = {
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export function normalizeAuthResponse(
  response: RawAuthResponse,
): SignInResponse {
  const payload = response.data ?? response;
  const accessToken =
    payload.accessToken ?? payload.access_token ?? payload.token;
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
};
