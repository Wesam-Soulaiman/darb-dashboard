import { useQuery } from "@tanstack/react-query";
import { countriesApi } from "../../api/locations/countriesApi";
import { locationQueryKeys } from "./locationQueryKeys";

export const useCountries = () => {
  return useQuery({
    queryKey: locationQueryKeys.countries(),
    queryFn: countriesApi.getCountries,
  });
};
