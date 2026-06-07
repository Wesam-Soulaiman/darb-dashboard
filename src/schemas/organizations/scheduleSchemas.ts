import { z } from "zod";

const dateStringSchema = z.string().min(1, "validation.required");

export const scheduleSchema = z
  .object({
    name: z
      .string()
      .min(1, "validation.required")
      .max(100, "validation.max100"),

    serviceCode: z
      .string()
      .min(1, "validation.required")
      .max(64, "validation.max64"),

    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),

    startDate: dateStringSchema,
    endDate: dateStringSchema,

    isActive: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const hasAtLeastOneDay =
      values.monday ||
      values.tuesday ||
      values.wednesday ||
      values.thursday ||
      values.friday ||
      values.saturday ||
      values.sunday;

    if (!hasAtLeastOneDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["monday"],
        message: "validation.selectAtLeastOneDay",
      });
    }

    if (
      values.startDate &&
      values.endDate &&
      new Date(values.startDate) > new Date(values.endDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "validation.endDateAfterStartDate",
      });
    }
  });

export const scheduleExceptionSchema = z.object({
  exceptionDate: dateStringSchema,

  exceptionType: z.coerce
    .number()
    .refine((value) => value === 1 || value === 2, {
      message: "validation.required",
    }),

  note: z
    .string()
    .max(255, "validation.max255")
    .optional()
    .transform((value) => {
      const normalized = value?.trim();
      return normalized ? normalized : undefined;
    }),
});

export type ScheduleFormInputValues = z.input<typeof scheduleSchema>;
export type ScheduleFormValues = z.output<typeof scheduleSchema>;

export type ScheduleExceptionFormInputValues = z.input<
  typeof scheduleExceptionSchema
>;
export type ScheduleExceptionFormValues = z.output<
  typeof scheduleExceptionSchema
>;
