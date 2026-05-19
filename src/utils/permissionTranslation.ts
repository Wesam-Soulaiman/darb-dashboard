import type { TFunction } from "i18next";
import type { Permission } from "../types/permission.types";

export const getPermissionActionLabel = (action: string, t: TFunction) => {
  return t(`permissions.actions.${action}`, {
    defaultValue: action,
  });
};

export const getPermissionResourceLabel = (
  resourceType: string,
  t: TFunction,
) => {
  return t(`permissions.resources.${resourceType}`, {
    defaultValue: resourceType,
  });
};

export const getPermissionLabel = (
  permission: Pick<Permission, "action" | "resourceType">,
  t: TFunction,
) => {
  return t("permissions.label", {
    action: getPermissionActionLabel(permission.action, t),
    resource: getPermissionResourceLabel(permission.resourceType, t),
  });
};
