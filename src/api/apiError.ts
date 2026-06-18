import axios from "axios";

export type ApiErrorResponse = {
  message?: string;
  error?: string;
  statusCode?: number;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred.",
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message || error.response?.data?.error;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getApiStatusCode(error: unknown): number | null {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }

  return null;
}
