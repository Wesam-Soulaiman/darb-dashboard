export interface Permission {
  id: number;
  action: string;
  resourceType: string;
  createdAt: string;
}

export interface PermissionsResponse {
  data: Permission[];
}
