import { apiClient } from "../apiClient";
import type {
  GetGovernatesParams,
  Governate,
  GovernatesResponse,
} from "../../types/governate.types";

const GOVERNATES_ENDPOINT = "/governates";

export const governatesApi = {
  getGovernates: async (params?: GetGovernatesParams) => {
    const { data } = await apiClient.get<GovernatesResponse>(
      GOVERNATES_ENDPOINT,
      {
        params,
      },
    );

    return data;
  },

  getGovernate: async (id: number) => {
    const { data } = await apiClient.get<Governate>(
      `${GOVERNATES_ENDPOINT}/${id}`,
    );

    return data;
  },
};
