import { useQuery } from "@tanstack/react-query";
import { permissionsApi } from "../../api/roles/permissionsApi";

export const permissionsQueryKeys = {
  all: ["permissions"] as const,
};

export const usePermissions = () => {
  return useQuery({
    queryKey: permissionsQueryKeys.all,
    queryFn: permissionsApi.getAll,
  });
};
