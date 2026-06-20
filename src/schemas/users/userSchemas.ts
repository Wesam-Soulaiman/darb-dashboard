import { z } from "zod";

import { isValidSyrianMobile, normalizeSyrianPhone } from "../../utils/syrianPhone";
import type { OperationalProfileStatus } from "../../types/user.types";

const phoneSchema = z
  .string()
  .min(1, "validation.required")
  .refine((value) => isValidSyrianMobile(value), "validation.invalidPhone")
  .transform((value) => normalizeSyrianPhone(value));

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const organizationIdSchema = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  })
  .refine(
    (value) => value === null || (Number.isFinite(value) && value > 0),
    "validation.required",
  );

const validateDriverFields = (
  values: {
    isDriver: boolean;
    licenseNumber?: string;
    licenseExpiry?: string;
  },
  context: z.RefinementCtx,
) => {
  if (!values.isDriver) {
    return;
  }

  if (!values.licenseNumber?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["licenseNumber"],
      message: "validation.required",
    });
  }

  if (!values.licenseExpiry?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["licenseExpiry"],
      message: "validation.required",
    });
  }
};

export const operationalProfileStatuses: OperationalProfileStatus[] = [
  "ACTIVE",
  "ON_LEAVE",
  "TERMINATED",
];

export const createUserSchema = z
  .object({
    phone: phoneSchema,

    firstName: z.string().trim().min(1, "validation.required"),

    lastName: z.string().trim().min(1, "validation.required"),

    email: z
      .string()
      .trim()
      .min(1, "validation.required")
      .email("validation.invalidEmail"),

    organizationId: organizationIdSchema,

    isActive: z.boolean(),

    isDriver: z.boolean(),

    hireDate: z.string().min(1, "validation.required"),

    licenseNumber: optionalTextSchema,

    licenseExpiry: optionalTextSchema,
  })
  .superRefine((values, context) => {
    if (values.isDriver && values.organizationId === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isDriver"],
        message: "users.validation.driverRequiresOrganization",
      });
    }

    validateDriverFields(values, context);
  });

export const updateUserSchema = z
  .object({
    phone: phoneSchema.optional(),

    firstName: z.string().trim().min(1, "validation.required"),

    lastName: z.string().trim().min(1, "validation.required"),

    email: z
      .string()
      .trim()
      .min(1, "validation.required")
      .email("validation.invalidEmail"),

    organizationId: z
      .union([z.number(), z.string(), z.null()])
      .optional()
      .transform((value) => {
        if (value === "") {
          return undefined;
        }

        if (value === null || value === undefined) {
          return value;
        }

        return Number(value);
      }),

    isDriver: z.boolean().optional(),
  })
  .superRefine((values, context) => {
    if (values.isDriver && values.organizationId === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isDriver"],
        message: "users.validation.driverRequiresOrganization",
      });
    }
  });

export const assignUserRoleSchema = z.object({
  roleId: z
    .union([z.number(), z.string()])
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, "validation.required"),
});

export const operationalProfileSchema = z
  .object({
    hireDate: z.string().min(1, "validation.required"),

    status: z.enum(["ACTIVE", "ON_LEAVE", "TERMINATED"]),

    isDriver: z.boolean(),

    licenseNumber: optionalTextSchema,

    licenseExpiry: optionalTextSchema,
  })
  .superRefine(validateDriverFields);

export const myProfileSchema = z.object({
  firstName: z.string().trim().min(1, "validation.required"),

  lastName: z.string().trim().min(1, "validation.required"),

  email: z.string().trim().min(1, "validation.required").email("validation.invalidEmail"),
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
