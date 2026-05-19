import { z } from "zod";

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "validation.imageRequired")
  .refine(
    (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
    "validation.onlyImagesAllowed",
  );

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "validation.required").max(100, "validation.max100"),
  codeName: z
    .string()
    .min(1, "validation.required")
    .max(50, "validation.max50")
    .regex(/^[a-zA-Z0-9_-]+$/, "validation.codeNameFormat"),
  icon: imageSchema,
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(1, "validation.required").max(100, "validation.max100"),
  codeName: z
    .string()
    .min(1, "validation.required")
    .max(50, "validation.max50")
    .regex(/^[a-zA-Z0-9_-]+$/, "validation.codeNameFormat"),
  icon: z
    .instanceof(File)
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      "validation.onlyImagesAllowed",
    )
    .optional()
    .nullable(),
});

export type CreateOrganizationFormValues = z.infer<
  typeof createOrganizationSchema
>;

export type UpdateOrganizationFormValues = z.infer<
  typeof updateOrganizationSchema
>;
