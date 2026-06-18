import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import {
  clearAuthSession,
  getAccessToken,
  getStoredAuthUser,
  type AuthUser,
} from "../core/auth/authStorage";

const EMPTY_PERMISSIONS: string[] = [];

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());

  const isAuthenticated = Boolean(getAccessToken());

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  const setAuthUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
  }, []);

  const value = useMemo(() => {
    const permissions = user?.permissions ?? EMPTY_PERMISSIONS;
    const isSuperAdmin = Boolean(user?.isSuperAdmin);
    const mustChangePassword = Boolean(user?.mustChangePassword);

    return {
      user,
      isAuthenticated,
      permissions,
      isSuperAdmin,
      mustChangePassword,
      logout,
      setAuthUser,
    };
  }, [user, isAuthenticated, logout, setAuthUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
