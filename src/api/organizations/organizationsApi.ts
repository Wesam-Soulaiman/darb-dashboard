import { apiClient } from "../apiClient";
import type {
  CreateOrganizationPayload,
  Organization,
  OrganizationsResponse,
  UpdateOrganizationPayload,
} from "../../types/organization.types";

const ORGANIZATIONS_ENDPOINT = "/organizations";

const buildOrganizationFormData = (
  payload: CreateOrganizationPayload | UpdateOrganizationPayload,
) => {
  const formData = new FormData();

  formData.append("name", payload.name ?? "");
  formData.append("codeName", payload.codeName ?? "");

  if (payload.icon instanceof File) {
    formData.append("icon", payload.icon, payload.icon.name);
  }

  return formData;
};

export const organizationsApi = {
  getAll: async () => {
    const response = await apiClient.get<OrganizationsResponse>(
      ORGANIZATIONS_ENDPOINT,
    );

    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Organization>(
      `${ORGANIZATIONS_ENDPOINT}/${id}`,
    );

    return response.data;
  },

  create: async (payload: CreateOrganizationPayload) => {
    const formData = buildOrganizationFormData(payload);

    const response = await apiClient.post<Organization>(
      ORGANIZATIONS_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  update: async (id: number, payload: UpdateOrganizationPayload) => {
    const formData = buildOrganizationFormData(payload);

    const response = await apiClient.patch<Organization>(
      `${ORGANIZATIONS_ENDPOINT}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<Organization>(
      `${ORGANIZATIONS_ENDPOINT}/${id}`,
    );

    return response.data;
  },
};
