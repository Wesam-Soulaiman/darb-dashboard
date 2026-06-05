import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "validation.required"),
    newPassword: z
      .string()
      .min(8, "validation.passwordMin")
      .regex(/[A-Z]/, "validation.passwordUppercase")
      .regex(/[a-z]/, "validation.passwordLowercase")
      .regex(/[0-9]/, "validation.passwordNumber"),
    confirmPassword: z.string().min(1, "validation.required"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "validation.passwordsDoNotMatch",
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    path: ["newPassword"],
    message: "validation.passwordSameAsCurrent",
  });

export type ChangePasswordFormInputValues = z.input<
  typeof changePasswordSchema
>;

export type ChangePasswordFormValues = z.output<typeof changePasswordSchema>;
