import { useQuery } from "@tanstack/react-query";
import { countriesApi } from "../../api/locations/countriesApi";
import { locationQueryKeys } from "./locationQueryKeys";

export const useCountry = (id?: number) => {
  return useQuery({
    queryKey: locationQueryKeys.country(id as number),
    queryFn: () => countriesApi.getCountry(id as number),
    enabled: Boolean(id),
  });
};
