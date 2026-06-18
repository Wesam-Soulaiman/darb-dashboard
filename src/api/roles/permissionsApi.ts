import { apiClient } from "../apiClient";
import type { PermissionsResponse } from "../../types/permission.types";

const PERMISSIONS_ENDPOINT = "/permissions";

export const permissionsApi = {
  getAll: async () => {
    const response = await apiClient.get<PermissionsResponse>(PERMISSIONS_ENDPOINT);

    return response.data.data;
  },
};
