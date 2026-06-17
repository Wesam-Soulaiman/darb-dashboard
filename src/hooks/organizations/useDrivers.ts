import { useUsers } from "../users/useUsers";
import type { GetUsersParams } from "../../types/user.types";

const DRIVER_ROLE_NAME = "driver";

type GetDriversParams = Omit<GetUsersParams, "organizationId" | "roleName">;

export const useDrivers = (orgId: number, params?: GetDriversParams) => {
  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  return useUsers(
    {
      ...params,
      organizationId: orgId,
      roleName: DRIVER_ROLE_NAME,
    },
    hasValidOrgId,
  );
};
