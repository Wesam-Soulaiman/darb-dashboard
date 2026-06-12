import type { Schedule } from "../../../../../types/schedule.types";
import { DAYS } from "./scheduleCalendar.constants";
import type { ScheduleDraft } from "./scheduleCalendar.types";

export const DEFAULT_SCHEDULE_COLOR = "#3A7CDFFF";

const hexColorRegex = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export const getToday = () => new Date().toISOString().slice(0, 10);

export const addDays = (dateValue: string, days: number) => {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const toDateInputValue = (
  value: string | null | undefined,
  fallback = getToday(),
) => {
  if (!value) return fallback;

  const normalizedValue = String(value);

  if (!normalizedValue.trim()) return fallback;

  return normalizedValue.slice(0, 10);
};

export const normalizeScheduleColor = (
  value: string | null | undefined,
  fallback = DEFAULT_SCHEDULE_COLOR,
) => {
  if (!value) return fallback;

  const color = String(value).trim();

  if (!hexColorRegex.test(color)) {
    return fallback;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return `${color.toUpperCase()}FF`;
  }

  return color.toUpperCase();
};

export const getScheduleBaseColor = (color: string | null | undefined) => {
  return normalizeScheduleColor(color).slice(0, 7);
};

export const getScheduleAlpha = (color: string | null | undefined) => {
  const normalizedColor = normalizeScheduleColor(color);

  if (normalizedColor.length !== 9) {
    return 1;
  }

  const alphaHex = normalizedColor.slice(7, 9);
  const alpha = Number.parseInt(alphaHex, 16) / 255;

  if (Number.isNaN(alpha)) {
    return 1;
  }

  return Number(alpha.toFixed(2));
};

export const getReadableTextColor = (color: string | null | undefined) => {
  const normalizedColor = normalizeScheduleColor(color);
  const hex = normalizedColor.slice(1, 7);

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.58 ? "#111827" : "#FFFFFF";
};

export const hexAlphaToRgba = (color: string | null | undefined) => {
  const normalizedColor = normalizeScheduleColor(color);

  const red = Number.parseInt(normalizedColor.slice(1, 3), 16);
  const green = Number.parseInt(normalizedColor.slice(3, 5), 16);
  const blue = Number.parseInt(normalizedColor.slice(5, 7), 16);
  const alpha = getScheduleAlpha(normalizedColor);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export const getOpaqueScheduleColor = (color: string | null | undefined) => {
  return `${getScheduleBaseColor(color)}FF`;
};

export const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ar-SY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const getDefaultDraft = (): ScheduleDraft => {
  const today = getToday();

  return {
    name: "",
    serviceCode: "",
    sunday: true,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: false,
    saturday: false,
    color: DEFAULT_SCHEDULE_COLOR,
    startDate: today,
    endDate: addDays(today, 30),
    isActive: true,
  };
};

export const scheduleToDraft = (schedule: Schedule): ScheduleDraft => {
  const today = getToday();

  return {
    name: schedule.name ?? "",
    serviceCode: schedule.serviceCode ?? "",
    sunday: Boolean(schedule.sunday),
    monday: Boolean(schedule.monday),
    tuesday: Boolean(schedule.tuesday),
    wednesday: Boolean(schedule.wednesday),
    thursday: Boolean(schedule.thursday),
    friday: Boolean(schedule.friday),
    saturday: Boolean(schedule.saturday),
    color: normalizeScheduleColor(schedule.color),
    startDate: toDateInputValue(schedule.startDate, today),
    endDate: toDateInputValue(schedule.endDate, addDays(today, 30)),
    isActive: Boolean(schedule.isActive),
  };
};

export const getActiveDayIndexes = (schedule: ScheduleDraft) => {
  return DAYS.filter((day) => schedule[day.key]).map(
    (day) => day.fullCalendarIndex,
  );
};

export const getActiveDaysCount = (schedule: ScheduleDraft) => {
  return DAYS.filter((day) => schedule[day.key]).length;
};

export const hasAtLeastOneDay = (draft: ScheduleDraft) => {
  return DAYS.some((day) => draft[day.key]);
};