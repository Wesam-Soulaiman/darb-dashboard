import { decryptValue, encryptValue } from "../../utils/encryption";

export const ACCESS_TOKEN_KEY = "darb_access_token";
export const REFRESH_TOKEN_KEY = "darb_refresh_token";
export const AUTH_USER_KEY = "darb_auth_user";

export type AuthPermission = string;

export type AuthRolePermission = {
  id: number;
  action: string;
  resourceType: string;
  createdAt: string;
};

export type AuthRole = {
  id: number;
  name: string;
  description?: string;
  organizationId?: number;
  permissions?: AuthRolePermission[];
  createdAt?: string;
  updatedAt?: string;
};

export type AuthUser = {
  id: number;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  mustChangePassword: boolean;
  roles: AuthRole[];
  permissions: AuthPermission[];
  organizationId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type SaveAuthSessionPayload = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function setEncryptedItem(key: string, value: string): void {
  if (!canUseLocalStorage()) return;

  const normalizedValue = typeof value === "string" ? value.trim() : "";

  if (!normalizedValue) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, encryptValue(normalizedValue));
}

function getDecryptedItem(key: string): string | null {
  if (!canUseLocalStorage()) return null;

  const encryptedValue = window.localStorage.getItem(key);

  if (!encryptedValue) return null;

  const value = decryptValue(encryptedValue);

  if (!value) {
    window.localStorage.removeItem(key);
    return null;
  }

  return value;
}

function removeItem(key: string): void {
  if (!canUseLocalStorage()) return;

  window.localStorage.removeItem(key);
}

export function getAccessToken(): string | null {
  return getDecryptedItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return getDecryptedItem(REFRESH_TOKEN_KEY);
}

export function getStoredAuthUser(): AuthUser | null {
  const value = getDecryptedItem(AUTH_USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function saveAuthSession({
  accessToken,
  refreshToken,
  user,
}: SaveAuthSessionPayload): void {
  setEncryptedItem(ACCESS_TOKEN_KEY, accessToken);
  setEncryptedItem(REFRESH_TOKEN_KEY, refreshToken);
  setEncryptedItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function updateAuthTokens(
  accessToken: string,
  refreshToken: string,
): void {
  setEncryptedItem(ACCESS_TOKEN_KEY, accessToken);
  setEncryptedItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthSession(): void {
  removeItem(ACCESS_TOKEN_KEY);
  removeItem(REFRESH_TOKEN_KEY);
  removeItem(AUTH_USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
