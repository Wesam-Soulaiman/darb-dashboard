import { z } from "zod";
import {
  isValidSyrianMobile,
  normalizeSyrianPhone,
} from "../../utils/syrianPhone";

const phoneSchema = z
  .string()
  .min(1, "validation.required")
  .refine((value) => isValidSyrianMobile(value), "validation.invalidPhone")
  .transform((value) => normalizeSyrianPhone(value));

export const userSchema = z.object({
  phone: phoneSchema,
  firstName: z
    .string()
    .min(1, "validation.required")
    .max(100, "validation.max100"),
  lastName: z
    .string()
    .min(1, "validation.required")
    .max(100, "validation.max100"),
  email: z
    .string()
    .min(1, "validation.required")
    .email("validation.invalidEmail"),
  organizationId: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return Number(value);
    }),
});

export const myProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "validation.required")
    .max(100, "validation.max100"),
  lastName: z
    .string()
    .min(1, "validation.required")
    .max(100, "validation.max100"),
  email: z
    .string()
    .min(1, "validation.required")
    .email("validation.invalidEmail"),
});

export type UserFormInputValues = z.input<typeof userSchema>;
export type UserFormValues = z.output<typeof userSchema>;

export type MyProfileFormInputValues = z.input<typeof myProfileSchema>;
export type MyProfileFormValues = z.output<typeof myProfileSchema>;
