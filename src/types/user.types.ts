import type { Role } from "./role.types";

export interface User {
  id: number;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  mustChangePassword: boolean;
  roles: Role[];
  permissions: string[];
  organizationId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersPaginationMeta {
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string | null;
}

export interface UsersPaginationLinks {
  next?: string | null;
}

export interface UsersResponse {
  data: User[];
  meta: UsersPaginationMeta;
  links?: UsersPaginationLinks;
}

export interface GetUsersParams {
  cursor?: string;
  limit?: number;
}

export interface CreateUserPayload {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId?: number | null;
}

export interface UpdateUserPayload {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId?: number | null;
}

export interface UpdateMyProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
}
