import type { DayKey } from "./scheduleCalendar.types";

export const MAX_SCHEDULES_LIMIT = 100;

export const DAYS: Array<{
  key: DayKey;
  fullLabelKey: string;
  shortLabelKey: string;
  fullCalendarIndex: number;
}> = [
  {
    key: "sunday",
    fullLabelKey: "schedules.days.sunday",
    shortLabelKey: "schedules.daysShort.sunday",
    fullCalendarIndex: 0,
  },
  {
    key: "monday",
    fullLabelKey: "schedules.days.monday",
    shortLabelKey: "schedules.daysShort.monday",
    fullCalendarIndex: 1,
  },
  {
    key: "tuesday",
    fullLabelKey: "schedules.days.tuesday",
    shortLabelKey: "schedules.daysShort.tuesday",
    fullCalendarIndex: 2,
  },
  {
    key: "wednesday",
    fullLabelKey: "schedules.days.wednesday",
    shortLabelKey: "schedules.daysShort.wednesday",
    fullCalendarIndex: 3,
  },
  {
    key: "thursday",
    fullLabelKey: "schedules.days.thursday",
    shortLabelKey: "schedules.daysShort.thursday",
    fullCalendarIndex: 4,
  },
  {
    key: "friday",
    fullLabelKey: "schedules.days.friday",
    shortLabelKey: "schedules.daysShort.friday",
    fullCalendarIndex: 5,
  },
  {
    key: "saturday",
    fullLabelKey: "schedules.days.saturday",
    shortLabelKey: "schedules.daysShort.saturday",
    fullCalendarIndex: 6,
  },
];
