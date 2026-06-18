import { z } from "zod";
import { isValidSyrianMobile, normalizeSyrianPhone } from "../../utils/syrianPhone";
import type { OperationalProfileStatus } from "../../types/user.types";

const phoneSchema = z
  .string()
  .min(1, "validation.required")
  .refine((value) => isValidSyrianMobile(value), "validation.invalidPhone")
  .transform((value) => normalizeSyrianPhone(value));

export const operationalProfileStatuses: OperationalProfileStatus[] = [
  "ACTIVE",
  "ON_LEAVE",
  "TERMINATED",
];

export const createUserSchema = z.object({
  phone: phoneSchema,
  firstName: z.string().min(1, "validation.required"),
  lastName: z.string().min(1, "validation.required"),
  email: z.string().min(1, "validation.required").email("validation.invalidEmail"),
  organizationId: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return Number(value);
    })
    .refine(
      (value) => value === null || (Number.isFinite(value) && value >= 0),
      "validation.required",
    ),
  isActive: z.boolean(),
  hireDate: z.string().min(1, "validation.required"),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
});

export const updateUserSchema = z.object({
  phone: phoneSchema.optional(),
  firstName: z.string().min(1, "validation.required"),
  lastName: z.string().min(1, "validation.required"),
  email: z.string().min(1, "validation.required").email("validation.invalidEmail"),
  organizationId: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((value) => {
      if (value === "" || value === undefined) return undefined;
      if (value === null) return null;
      return Number(value);
    }),
});

export const assignUserRoleSchema = z.object({
  roleId: z
    .union([z.number(), z.string()])
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, "validation.required"),
});

export const operationalProfileSchema = z.object({
  hireDate: z.string().optional(),
  status: z.enum(["ACTIVE", "ON_LEAVE", "TERMINATED"]),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
});

export const myProfileSchema = z.object({
  firstName: z.string().min(1, "validation.required"),
  lastName: z.string().min(1, "validation.required"),
  email: z.string().min(1, "validation.required").email("validation.invalidEmail"),
});

export type CreateUserFormInputValues = z.input<typeof createUserSchema>;
export type CreateUserFormValues = z.output<typeof createUserSchema>;

export type UpdateUserFormInputValues = z.input<typeof updateUserSchema>;
export type UpdateUserFormValues = z.output<typeof updateUserSchema>;

export type AssignUserRoleFormInputValues = z.input<typeof assignUserRoleSchema>;
export type AssignUserRoleFormValues = z.output<typeof assignUserRoleSchema>;

export type OperationalProfileFormInputValues = z.input<typeof operationalProfileSchema>;
export type OperationalProfileFormValues = z.output<typeof operationalProfileSchema>;

export type MyProfileFormInputValues = z.input<typeof myProfileSchema>;
export type MyProfileFormValues = z.output<typeof myProfileSchema>;
