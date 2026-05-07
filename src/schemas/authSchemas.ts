import { z } from "zod";

import { isValidSyrianMobile } from "../utils/syrianPhone";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "auth.validation.phoneRequired")
    .refine(isValidSyrianMobile, "auth.validation.invalidSyrianPhone"),

  password: z
    .string()
    .min(1, "auth.validation.passwordRequired")
    .min(8, "auth.validation.passwordMin"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
