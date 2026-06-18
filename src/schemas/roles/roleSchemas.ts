import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "validation.required").max(100, "validation.max100"),
  description: z.string().min(1, "validation.required").max(255, "validation.max255"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
