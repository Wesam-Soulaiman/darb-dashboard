import { useMemo } from "react";

import { useAuthContext } from "../contexts/AuthContext";
import type { AppMenuItem } from "../menu-items/menu.types";

function hasPermission(
  requiredPermission: string | undefined,
  permissions: string[],
  isSuperAdmin: boolean,
): boolean {
  if (isSuperAdmin) return true;
  if (!requiredPermission) return true;

  return permissions.includes(requiredPermission);
}

function filterMenuItems(
  items: AppMenuItem[],
  permissions: string[],
  isSuperAdmin: boolean,
): AppMenuItem[] {
  return items
    .map((item) => {
      if (item.children?.length) {
        const children = filterMenuItems(
          item.children,
          permissions,
          isSuperAdmin,
        );

        return {
          ...item,
          children,
        };
      }

      return { ...item };
    })
    .filter((item) => {
      if (item.children) {
        return item.children.length > 0;
      }

      return hasPermission(item.permission, permissions, isSuperAdmin);
    });
}

export function useFilteredMenu(menuItems: AppMenuItem[]) {
  const { permissions, isSuperAdmin } = useAuthContext();

  return useMemo(() => {
    return filterMenuItems(menuItems, permissions, isSuperAdmin);
  }, [menuItems, permissions, isSuperAdmin]);
}
