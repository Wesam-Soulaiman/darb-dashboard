import { z } from "zod";

const optionalDateString = z
  .string()
  .optional()
  .transform((value) => {
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
  });

export const busTypeSchema = z.enum(["STANDARD", "MINIBUS", "ARTICULATED"]);

export const busStatusSchema = z.enum([
  "AVAILABLE",
  "IN_SERVICE",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
]);

export const createBusSchema = z.object({
  plateNumber: z
    .string()
    .min(1, "validation.required")
    .max(50, "validation.max50"),

  type: busTypeSchema,

  capacity: z.coerce
    .number()
    .int("validation.integer")
    .min(1, "validation.min1"),

  manufacturer: z
    .string()
    .min(1, "validation.required")
    .max(100, "validation.max100"),

  model: z.string().min(1, "validation.required").max(100, "validation.max100"),

  year: z.coerce
    .number()
    .int("validation.integer")
    .min(1950, "validation.invalidYear")
    .max(2100, "validation.invalidYear"),

  registrationExpiry: z.string().min(1, "validation.required"),

  status: busStatusSchema.optional(),
  lastMaintenanceDate: optionalDateString,
  nextMaintenanceDate: optionalDateString,
});

export const updateBusSchema = createBusSchema.extend({
  status: busStatusSchema,
});

export type BusFormInputValues = z.input<typeof createBusSchema>;
export type BusFormValues = z.output<typeof createBusSchema>;

export type CreateBusFormValues = z.output<typeof createBusSchema>;
export type UpdateBusFormValues = z.output<typeof updateBusSchema>;
