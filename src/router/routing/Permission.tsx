import type { ReactNode } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

interface PermissionProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const Permission = ({ permission, children, fallback = null }: PermissionProps) => {
  const { permissions, isSuperAdmin } = useAuthContext();

  if (isSuperAdmin || permissions.includes(permission)) {
    return children;
  }

  return fallback;
};

export default Permission;
