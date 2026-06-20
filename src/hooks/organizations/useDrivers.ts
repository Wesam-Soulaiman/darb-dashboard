import { useUsers } from "../users/useUsers";
import type { GetUsersParams } from "../../types/user.types";

type GetDriversParams = Omit<GetUsersParams, "organizationId" | "roleName" | "isDriver">;

export const useDrivers = (orgId: number, params?: GetDriversParams) => {
  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  return useUsers(
    {
      ...params,
      organizationId: orgId,
      isDriver: true,
    },
    hasValidOrgId,
  );
};
