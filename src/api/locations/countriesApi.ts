import { apiClient } from "../apiClient";
import type { CountriesResponse, Country } from "../../types/country.types";

const COUNTRIES_ENDPOINT = "/countries";

export const countriesApi = {
  getCountries: async () => {
    const { data } = await apiClient.get<CountriesResponse>(COUNTRIES_ENDPOINT);

    return data;
  },

  getCountry: async (id: number) => {
    const { data } = await apiClient.get<Country>(`${COUNTRIES_ENDPOINT}/${id}`);

    return data;
  },
};
