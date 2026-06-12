import type { ScheduleExceptionType } from "../../../../../types/schedule.types";

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ScheduleDraft = {
  name: string;
  serviceCode: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  color: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type ExceptionDraft = {
  exceptionDate: string;
  exceptionType: ScheduleExceptionType;
  note: string;
};

export type ScheduleDialogMode = "create" | "edit";

export type DayPreset = "all" | "workdays" | "weekend" | "clear";

export type UpdateScheduleDraft = <Key extends keyof ScheduleDraft>(
  key: Key,
  value: ScheduleDraft[Key],
) => void;

export type UpdateExceptionDraft = <Key extends keyof ExceptionDraft>(
  key: Key,
  value: ExceptionDraft[Key],
) => void;
