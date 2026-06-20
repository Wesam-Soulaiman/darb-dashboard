import { z } from "zod";

const requiredNumericIdSchema = z
  .string()
  .trim()
  .min(1, "validation.required")
  .regex(/^\d+$/, "validation.required");

export const runAssignmentSchema = z.object({
  driverId: requiredNumericIdSchema,
  busId: requiredNumericIdSchema,
});

export type RunAssignmentFormInputValues = z.input<typeof runAssignmentSchema>;

export type RunAssignmentFormValues = z.output<typeof runAssignmentSchema>;

export const cancelRunSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "runs.cancel.validation.reasonRequired")
    .max(500, "runs.cancel.validation.reasonTooLong"),
});

export type CancelRunFormValues = z.infer<typeof cancelRunSchema>;
