import dayjs from "dayjs";

const GTFS_TIME_REGEX = /^\d{2,}:[0-5]\d:[0-5]\d$/;

const SECONDS_PER_DAY = 24 * 60 * 60;

const parseGtfsTime = (value: string): number | null => {
  const normalizedValue = value.trim();

  if (!GTFS_TIME_REGEX.test(normalizedValue)) {
    return null;
  }

  const [hours = 0, minutes = 0, seconds = 0] = normalizedValue.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

const formatGtfsTime = (totalSeconds: number): string => {
  const normalizedSeconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(normalizedSeconds / 3600);
  const minutes = Math.floor((normalizedSeconds % 3600) / 60);
  const seconds = normalizedSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
};

const getUtcOffsetSeconds = (date?: string): number => {
  const referenceDate = date && dayjs(date).isValid() ? dayjs(date) : dayjs();

  return referenceDate.utcOffset() * 60;
};

export const localGtfsTimeToUtc = (value: string, date?: string): string => {
  const localSeconds = parseGtfsTime(value);

  if (localSeconds === null) {
    return value;
  }

  let utcSeconds = localSeconds - getUtcOffsetSeconds(date);

  while (utcSeconds < 0) {
    utcSeconds += SECONDS_PER_DAY;
  }

  return formatGtfsTime(utcSeconds);
};

export const utcGtfsTimeToLocal = (value: string, date?: string): string => {
  const utcSeconds = parseGtfsTime(value);

  if (utcSeconds === null) {
    return value;
  }

  const localSeconds = utcSeconds + getUtcOffsetSeconds(date);

  return formatGtfsTime(localSeconds);
};
