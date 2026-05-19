import { useQuery } from "@tanstack/react-query";
import { governatesApi } from "../../api/locations/governatesApi";
import { locationQueryKeys } from "./locationQueryKeys";

export const useGovernate = (id?: number) => {
  return useQuery({
    queryKey: locationQueryKeys.governate(id as number),
    queryFn: () => governatesApi.getGovernate(id as number),
    enabled: Boolean(id),
  });
};
