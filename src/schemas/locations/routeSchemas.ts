import { z } from "zod";

export const transitModes = [
  "air",
  "bus",
  "cableway",
  "coach",
  "lift",
  "metro",
  "monorail",
  "rail",
  "tram",
] as const;

export const routeLineSchema = z.object({
  type: z.literal("LineString"),
  coordinates: z
    .array(z.tuple([z.number(), z.number()]))
    .min(2, "validation.routeLineMinPoints"),
  bbox: z.array(z.number()).optional(),
});

export const routeSchema = z.object({
  name: z.string().min(1, "validation.required").max(150, "validation.max150"),

  originPlaceId: z
    .union([z.number(), z.string()])
    .transform((value) => Number(value))
    .refine((value) => value > 0, "validation.required"),

  destinationPlaceId: z
    .union([z.number(), z.string()])
    .transform((value) => Number(value))
    .refine((value) => value > 0, "validation.required"),

  mode: z.enum(transitModes, {
    message: "validation.required",
  }),

  price: z.object({
    amount: z
      .string()
      .min(1, "validation.required")
      .refine((value) => Number(value) >= 0, "validation.invalidNumber"),
    currency: z.literal("SYP"),
  }),

  line: routeLineSchema,
});

export type RouteFormInputValues = z.input<typeof routeSchema>;
export type RouteFormValues = z.output<typeof routeSchema>;
