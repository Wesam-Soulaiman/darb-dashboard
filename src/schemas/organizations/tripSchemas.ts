import { z } from "zod";

const optionalStringSchema = z
  .string()
  .trim()
  .max(100, "validation.max100")
  .optional()
  .transform((value) => value || undefined);

const optionalIdSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

export const tripSchema = z.object({
  routeId: z
    .string()
    .trim()
    .min(1, "validation.required"),

  scheduleId: z
    .string()
    .trim()
    .min(1, "validation.required"),

  headsign: z
    .string()
    .trim()
    .min(1, "validation.required")
    .max(120, "validation.max120"),

  defaultBusId: optionalIdSchema,

  blockId: optionalStringSchema,

  isActive: z.boolean(),
});

export type TripFormInputValues =
  z.input<typeof tripSchema>;

export type TripFormValues =
  z.output<typeof tripSchema>;