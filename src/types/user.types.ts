export interface PagePaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PagePaginatedResponse<T> {
  data: T[];
  meta: PagePaginationMeta;
}

export interface UserPermission {
  id: number;
  action: string;
  resourceType: string;
  createdAt: string;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
  organizationId: number | null;
  permissions: UserPermission[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleSummary {
  id: number;
  name: string;
}

export type OperationalProfileStatus = "ACTIVE" | "ON_LEAVE" | "TERMINATED";

export interface OperationalProfile {
  employeeCode: string;
  hireDate: string;
  status: OperationalProfileStatus;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
}

export type UserOperationalProfileSummary = Pick<
  OperationalProfile,
  "employeeCode" | "hireDate" | "status" | "licenseExpiry"
>;

export interface UserListItem {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId: number | null;
  isActive: boolean;
  roles: UserRoleSummary[];
  profile: UserOperationalProfileSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  mustChangePassword: boolean;
  roles: UserRole[];
  permissions: string[];
  organizationId: number | null;
  createdAt: string;
  updatedAt: string;
}

export type UsersResponse = PagePaginatedResponse<UserListItem>;

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OperationalProfileStatus;
  roleName?: string;
  organizationId?: number;
}

export interface CreateUserPayload {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId: number | null;
  isActive: boolean;
  hireDate: string;
  licenseNumber?: string;
  licenseExpiry?: string;
}

export interface CreatedUser {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  profile: OperationalProfile | null;
}

export interface UpdateUserPayload {
  phone?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  organizationId?: number | null;
}

export interface AssignUserRolePayload {
  roleId: number;
}

export interface AssignUserRoleResponse {
  userId: number;
  role: UserRoleSummary;
}

export interface UnassignUserRolePayload {
  roleId: number;
}

export interface UnassignUserRoleResponse {
  userId: number;
  role: UserRoleSummary;
}

export interface UpdateOperationalProfilePayload {
  hireDate?: string;
  status?: OperationalProfileStatus;
  licenseNumber?: string;
  licenseExpiry?: string;
}

export interface UpdateMyProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
}
