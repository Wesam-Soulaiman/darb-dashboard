import { useQuery } from "@tanstack/react-query";
import { governatesApi } from "../../api/locations/governatesApi";
import type { GetGovernatesParams } from "../../types/governate.types";
import { locationQueryKeys } from "./locationQueryKeys";

export const useGovernates = (params?: GetGovernatesParams) => {
  return useQuery({
    queryKey: locationQueryKeys.governates(params),
    queryFn: () => governatesApi.getGovernates(params),
  });
};
