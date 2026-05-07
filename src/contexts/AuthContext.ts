import { createContext, useContext } from "react";

import type { AuthUser } from "../core/auth/authStorage";

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  permissions: string[];
  isSuperAdmin: boolean;
  mustChangePassword: boolean;
  logout: () => void;
  setAuthUser: (user: AuthUser | null) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  permissions: [],
  isSuperAdmin: false,
  mustChangePassword: false,
  logout: () => undefined,
  setAuthUser: () => undefined,
});

export function useAuthContext() {
  return useContext(AuthContext);
}
