import type { AuthUser } from "../core/auth/authStorage";

export type SignInPayload = {
  phone: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type RawAuthResponse = Partial<SignInResponse> & {
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

export type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
