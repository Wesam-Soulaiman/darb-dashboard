import { z } from "zod";

export const stopCoordinatesSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
  bbox: z.array(z.number()).optional(),
});

export const stopSchema = z.object({
  name: z.string().min(1, "validation.required").max(150, "validation.max150"),

  placeId: z
    .union([z.number(), z.string()])
    .transform((value) => Number(value))
    .refine((value) => value > 0, "validation.required"),

  coordinates: stopCoordinatesSchema,
});

export type StopFormInputValues = z.input<typeof stopSchema>;
export type StopFormValues = z.output<typeof stopSchema>;
