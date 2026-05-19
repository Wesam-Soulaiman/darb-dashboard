export interface Organization {
  id: number;
  name: string;
  codeName: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationsResponse {
  data: Organization[];
}

export interface CreateOrganizationPayload {
  name: string;
  codeName: string;
  icon: File;
}

export interface UpdateOrganizationPayload {
  name?: string;
  codeName?: string;
  icon?: File | null;
}
