import type { TripSetupStop } from "../tripSetup.types";
import {
  DEFAULT_DWELL_MINUTES,
  DEFAULT_TRAVEL_MINUTES,
  DEFAULT_TRIP_START_TIME,
  gtfsTimeToSeconds,
  isValidGtfsTime,
  secondsToGtfsTime,
} from "../tripSetup.utils";

export const toNonNegativeInteger = (value: unknown, fallback = 0) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.max(0, Math.round(parsedValue));
};

export const getEffectiveDwellMinutes = (stop: TripSetupStop) => {
  if (!stop.enabled) {
    return 0;
  }

  return toNonNegativeInteger(stop.dwellMinutes, DEFAULT_DWELL_MINUTES);
};

export const cloneTripStops = (stops: TripSetupStop[]) => {
  return stops.map((stop) => ({ ...stop }));
};

export const patchTripStop = (
  stops: TripSetupStop[],
  index: number,
  patch: Partial<TripSetupStop>,
) => {
  return stops.map((stop, stopIndex) =>
    stopIndex === index
      ? {
          ...stop,
          ...patch,
        }
      : stop,
  );
};

const getSafePreviousDepartureTime = (stop: TripSetupStop) => {
  if (isValidGtfsTime(stop.departureTime)) {
    return stop.departureTime;
  }

  if (isValidGtfsTime(stop.arrivalTime)) {
    return stop.arrivalTime;
  }

  return DEFAULT_TRIP_START_TIME;
};

export const recalculateStopsFromIndex = (
  sourceStops: TripSetupStop[],
  startIndex: number,
) => {
  const nextStops = cloneTripStops(sourceStops);

  if (nextStops.length === 0 || startIndex >= nextStops.length) {
    return nextStops;
  }

  const safeStartIndex = Math.max(0, startIndex);

  for (let index = safeStartIndex; index < nextStops.length; index += 1) {
    const stop = nextStops[index];
    const dwellMinutes = getEffectiveDwellMinutes(stop);

    if (index === 0) {
      const arrivalTime = isValidGtfsTime(stop.arrivalTime)
        ? stop.arrivalTime
        : DEFAULT_TRIP_START_TIME;

      nextStops[index] = {
        ...stop,
        stopSequence: 1,
        travelMinutesFromPrevious: 0,
        dwellMinutes,
        arrivalTime,
        departureTime: secondsToGtfsTime(
          gtfsTimeToSeconds(arrivalTime) + dwellMinutes * 60,
        ),
      };

      continue;
    }

    const previousStop = nextStops[index - 1];

    const previousDepartureSeconds = gtfsTimeToSeconds(
      getSafePreviousDepartureTime(previousStop),
    );

    const travelMinutes = toNonNegativeInteger(
      stop.travelMinutesFromPrevious,
      DEFAULT_TRAVEL_MINUTES,
    );

    const arrivalSeconds = previousDepartureSeconds + travelMinutes * 60;

    nextStops[index] = {
      ...stop,
      stopSequence: index + 1,
      travelMinutesFromPrevious: travelMinutes,
      dwellMinutes,
      arrivalTime: secondsToGtfsTime(arrivalSeconds),
      departureTime: secondsToGtfsTime(arrivalSeconds + dwellMinutes * 60),
    };
  }

  return nextStops;
};

export const generateAllStopTimes = (
  stops: TripSetupStop[],
  startTime: string,
  defaultTravelMinutes: number,
  defaultDwellMinutes: number,
) => {
  const normalizedStartTime = isValidGtfsTime(startTime)
    ? startTime
    : DEFAULT_TRIP_START_TIME;

  const normalizedTravelMinutes = toNonNegativeInteger(
    defaultTravelMinutes,
    DEFAULT_TRAVEL_MINUTES,
  );

  const normalizedDwellMinutes = toNonNegativeInteger(
    defaultDwellMinutes,
    DEFAULT_DWELL_MINUTES,
  );

  const stopsWithDefaults = stops.map((stop, index) => ({
    ...stop,
    stopSequence: index + 1,

    travelMinutesFromPrevious: index === 0 ? 0 : normalizedTravelMinutes,

    dwellMinutes: stop.enabled ? normalizedDwellMinutes : 0,

    ...(index === 0
      ? {
          arrivalTime: normalizedStartTime,
        }
      : {}),
  }));

  return recalculateStopsFromIndex(stopsWithDefaults, 0);
};

export const ensureTimeNotBefore = (value: string, minimumValue: string) => {
  if (!isValidGtfsTime(value) || !isValidGtfsTime(minimumValue)) {
    return value;
  }

  return gtfsTimeToSeconds(value) < gtfsTimeToSeconds(minimumValue)
    ? minimumValue
    : value;
};

export const getMinutesBetweenTimes = (
  startTime: string,
  endTime: string,
  fallback = 0,
) => {
  if (!isValidGtfsTime(startTime) || !isValidGtfsTime(endTime)) {
    return fallback;
  }

  const differenceSeconds = gtfsTimeToSeconds(endTime) - gtfsTimeToSeconds(startTime);

  if (differenceSeconds < 0) {
    return fallback;
  }

  return Math.round(differenceSeconds / 60);
};
