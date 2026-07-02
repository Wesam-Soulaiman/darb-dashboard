import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  updateAuthTokens,
} from "../core/auth/authStorage";
import {
  gzipJsonPayload,
  MIN_GZIP_SIZE_BYTES,
  shouldCompressJsonPayload,
} from "../utils/requestCompression";

declare module "axios" {
  export interface AxiosRequestConfig {
    compress?: boolean;
    compressionMinSizeBytes?: number;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const LOGIN_PATH = "/auth/login";
const REFRESH_ENDPOINT = "/auth/refresh";
const AUTH_ENDPOINT_PREFIX = "/auth";
const COMPRESSIBLE_METHODS = new Set(["post", "put", "patch"]);

type RawRefreshResponse = Partial<RefreshResponse> & {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  data?: Partial<RefreshResponse> & {
    access_token?: string;
    refresh_token?: string;
    token?: string;
  };
};

export type RequestOptions<D = unknown> = AxiosRequestConfig<D> & {
  url: string;
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

type InternalRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

let authExpiredHandler: (() => void) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export function setAuthExpiredHandler(handler: (() => void) | null): void {
  authExpiredHandler = handler;
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;

  if (authExpiredHandler) {
    authExpiredHandler();
    return;
  }

  if (window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
}

function handleAuthExpired(): void {
  clearAuthSession();
  redirectToLogin();
}

function attachBearerToken(
  config: InternalRequestConfig,
  token: string,
): InternalRequestConfig {
  const headers = AxiosHeaders.from(config.headers);

  headers.set("Authorization", `Bearer ${token}`);

  config.headers = headers;

  return config;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) return null;

  const response = await axios.post<RawRefreshResponse>(
    `${API_BASE_URL}${REFRESH_ENDPOINT}`,
    {
      refreshToken,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  const payload = response.data.data ?? response.data;
  const nextAccessToken = payload.accessToken ?? payload.access_token ?? payload.token;
  const nextRefreshToken = payload.refreshToken ?? payload.refresh_token ?? refreshToken;

  if (!nextAccessToken || !nextRefreshToken) {
    return null;
  }

  updateAuthTokens(nextAccessToken, nextRefreshToken);

  return nextAccessToken;
}

function getRefreshPromise(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function isCompressibleMethod(method?: string): boolean {
  return COMPRESSIBLE_METHODS.has((method ?? "get").toLowerCase());
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.startsWith("http")
    ? new URL(url).pathname
    : url.startsWith("/")
      ? url
      : `/${url}`;

  return (
    normalizedUrl === AUTH_ENDPOINT_PREFIX ||
    normalizedUrl.startsWith(`${AUTH_ENDPOINT_PREFIX}/`)
  );
}

function hasJsonContentType(headers: AxiosHeaders): boolean {
  const contentType = headers.get("Content-Type");

  if (!contentType) {
    return true;
  }

  const normalizedContentType = String(contentType).toLowerCase();

  return (
    normalizedContentType.includes("application/json") ||
    normalizedContentType.includes("+json")
  );
}

function applyRequestCompression(config: InternalRequestConfig): InternalRequestConfig {
  if (!config.compress || !isCompressibleMethod(config.method)) {
    return config;
  }

  if (isAuthEndpoint(config.url)) {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers);

  if (!hasJsonContentType(headers)) {
    return config;
  }

  const minSize = config.compressionMinSizeBytes ?? MIN_GZIP_SIZE_BYTES;

  if (!shouldCompressJsonPayload(config.data, minSize)) {
    return config;
  }

  config.data = gzipJsonPayload(config.data);

  headers.set("Content-Type", "application/json");
  headers.set("Content-Encoding", "gzip");

  config.headers = headers;

  return config;
}

apiClient.interceptors.request.use((config) => {
  const requestConfig = config as InternalRequestConfig;

  applyRequestCompression(requestConfig);

  if (requestConfig.skipAuth) {
    return requestConfig;
  }

  const accessToken = getAccessToken();

  if (accessToken) {
    return attachBearerToken(requestConfig, accessToken);
  }

  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;

    const shouldTryRefresh =
      isUnauthorized &&
      !originalRequest._retry &&
      !originalRequest.skipAuth &&
      !originalRequest.skipRefresh &&
      !originalRequest.url?.includes(REFRESH_ENDPOINT);

    if (!shouldTryRefresh) {
      if (isUnauthorized && !originalRequest.skipAuth) {
        handleAuthExpired();
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const nextAccessToken = await getRefreshPromise();

      if (!nextAccessToken) {
        handleAuthExpired();
        return Promise.reject(error);
      }

      attachBearerToken(originalRequest, nextAccessToken);

      return apiClient(originalRequest);
    } catch (refreshError) {
      handleAuthExpired();
      return Promise.reject(refreshError);
    }
  },
);

export async function requestData<T = unknown, D = unknown>(
  options: RequestOptions<D>,
): Promise<T> {
  const response = await apiClient.request<T, { data: T }, D>(options);

  return response.data;
}
