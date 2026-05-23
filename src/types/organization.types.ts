import type { TransitRoute } from "./route.types";

export interface OrganizationRoute {
  id: number;
  route: TransitRoute;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  codeName: string;
  icon: string;
  orgRoutes?: OrganizationRoute[];
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

export interface AssignOrganizationRoutePayload {
  routeId: string;
}

export type RemoveOrganizationRoutePayload = AssignOrganizationRoutePayload;
