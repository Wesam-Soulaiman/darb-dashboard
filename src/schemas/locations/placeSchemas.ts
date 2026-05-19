import { z } from "zod";

export const placeCenterSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
  bbox: z.array(z.number()).optional(),
});

export const placeSchema = z.object({
  name: z.string().min(1, "validation.required").max(150, "validation.max150"),
  countryId: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return Number(value);
    }),
  governateId: z
    .union([z.number(), z.string()])
    .transform((value) => Number(value))
    .refine((value) => value > 0, "validation.required"),
  center: placeCenterSchema,
});

export type PlaceFormInputValues = z.input<typeof placeSchema>;
export type PlaceFormValues = z.output<typeof placeSchema>;
