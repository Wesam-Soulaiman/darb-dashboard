import { z } from "zod";

import { isValidSyrianMobile } from "../../utils/syrianPhone";

export const resetPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, "auth.validation.phoneRequired")
    .refine(isValidSyrianMobile, "auth.validation.invalidSyrianPhone"),
});

export type ResetPhoneFormValues = z.infer<typeof resetPhoneSchema>;

export const resetOtpSchema = z.object({
  otp: z
    .string()
    .min(1, "auth.validation.otpRequired")
    .regex(/^\d{5}$/, "auth.validation.invalidOtp"),
});

export type ResetOtpFormValues = z.infer<typeof resetOtpSchema>;

export const resetNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "auth.validation.passwordRequired")
      .min(8, "auth.validation.passwordMin"),

    confirmPassword: z
      .string()
      .min(1, "auth.validation.confirmPasswordRequired"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "auth.validation.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type ResetNewPasswordFormValues = z.infer<typeof resetNewPasswordSchema>;
