import type { RouteNode } from "../../../../../types/route.types";
import type {
  GtfsPickupDropOffType,
  GtfsTimepoint,
  ReplaceTripFrequenciesPayload,
  ReplaceTripStopTimesPayload,
  TripFrequency,
  TripStopTime,
} from "../../../../../types/trip.types";
import type {
  TripSetupFrequencyWindow,
  TripSetupStop,
  TripSetupValidationResult,
} from "./tripSetup.types";

export const DEFAULT_TRIP_START_TIME = "08:00:00";
export const DEFAULT_TRAVEL_MINUTES = 5;
export const DEFAULT_DWELL_MINUTES = 1;

const GTFS_TIME_REGEX = /^\d{2,}:[0-5]\d:[0-5]\d$/;

export const isValidGtfsTime = (value: string) => {
  return GTFS_TIME_REGEX.test(value.trim());
};

export const gtfsTimeToSeconds = (value: string) => {
  if (!isValidGtfsTime(value)) {
    return 0;
  }

  const [hours, minutes, seconds] = value
    .trim()
    .split(":")
    .map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

export const secondsToGtfsTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
};

const normalizePositiveNumber = (
  value: number,
  fallback: number,
  allowZero = true,
) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  if (allowZero) {
    return Math.max(0, parsedValue);
  }

  return Math.max(1, parsedValue);
};

const getDurationMinutes = (
  startTime: string,
  endTime: string,
  fallback: number,
) => {
  if (!isValidGtfsTime(startTime) || !isValidGtfsTime(endTime)) {
    return fallback;
  }

  const difference =
    (gtfsTimeToSeconds(endTime) - gtfsTimeToSeconds(startTime)) / 60;

  if (!Number.isFinite(difference) || difference < 0) {
    return fallback;
  }

  return Math.round(difference);
};

const getRouteNodeName = (routeNode: RouteNode) => {
  return routeNode.node?.name || routeNode.node?.id || "-";
};

export const createFrequencyWindowId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `frequency-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

export const buildTripSetupStops = (
  routeStops: RouteNode[],
  existingStopTimes: TripStopTime[],
): TripSetupStop[] => {
  const sortedRouteStops = [...routeStops].sort(
    (first, second) => first.ordering - second.ordering,
  );

  const existingStopTimesMap = new Map(
    existingStopTimes.map((stopTime) => [stopTime.stopId, stopTime]),
  );

  const hasSavedStopTimes = existingStopTimes.length > 0;

  let previousDepartureSeconds = gtfsTimeToSeconds(DEFAULT_TRIP_START_TIME);

  return sortedRouteStops.map((routeStop, index) => {
    const existingStop = existingStopTimesMap.get(routeStop.node.id);

    const previousRouteStop = sortedRouteStops[index - 1];

    const previousExistingStop = previousRouteStop
      ? existingStopTimesMap.get(previousRouteStop.node.id)
      : undefined;

    const generatedArrivalSeconds =
      index === 0
        ? gtfsTimeToSeconds(DEFAULT_TRIP_START_TIME)
        : previousDepartureSeconds + DEFAULT_TRAVEL_MINUTES * 60;

    const generatedArrivalTime = secondsToGtfsTime(generatedArrivalSeconds);

    const generatedDepartureTime = secondsToGtfsTime(
      generatedArrivalSeconds + DEFAULT_DWELL_MINUTES * 60,
    );

    const arrivalTime = existingStop?.arrivalTime ?? generatedArrivalTime;
    const departureTime = existingStop?.departureTime ?? generatedDepartureTime;

    const travelMinutesFromPrevious =
      index === 0
        ? 0
        : previousExistingStop && existingStop
          ? getDurationMinutes(
              previousExistingStop.departureTime,
              existingStop.arrivalTime,
              DEFAULT_TRAVEL_MINUTES,
            )
          : DEFAULT_TRAVEL_MINUTES;

    const dwellMinutes = existingStop
      ? getDurationMinutes(
          existingStop.arrivalTime,
          existingStop.departureTime,
          DEFAULT_DWELL_MINUTES,
        )
      : DEFAULT_DWELL_MINUTES;

    previousDepartureSeconds = gtfsTimeToSeconds(departureTime);

    return {
      stopId: routeStop.node.id,
      stopName: getRouteNodeName(routeStop),
      routeOrder: routeStop.ordering,
      enabled: hasSavedStopTimes ? Boolean(existingStop) : true,
      stopSequence: index + 1,
      arrivalTime,
      departureTime,
      travelMinutesFromPrevious,
      dwellMinutes,
      pickupType: (existingStop?.pickupType ??
        0) as GtfsPickupDropOffType,
      dropOffType: (existingStop?.dropOffType ??
        0) as GtfsPickupDropOffType,
      timepoint: (existingStop?.timepoint ?? 1) as GtfsTimepoint,
    };
  });
};

export const regenerateTripStopTimes = (
  stops: TripSetupStop[],
  startTime: string,
  defaultTravelMinutes = DEFAULT_TRAVEL_MINUTES,
  defaultDwellMinutes = DEFAULT_DWELL_MINUTES,
): TripSetupStop[] => {
  const normalizedStartTime = isValidGtfsTime(startTime)
    ? startTime
    : DEFAULT_TRIP_START_TIME;

  let previousDepartureSeconds = gtfsTimeToSeconds(normalizedStartTime);

  return stops.map((stop, index) => {
    const travelMinutes =
      index === 0
        ? 0
        : normalizePositiveNumber(
            stop.travelMinutesFromPrevious,
            defaultTravelMinutes,
          );

    const dwellMinutes = normalizePositiveNumber(
      stop.dwellMinutes,
      defaultDwellMinutes,
    );

    const arrivalSeconds =
      index === 0
        ? gtfsTimeToSeconds(normalizedStartTime)
        : previousDepartureSeconds + travelMinutes * 60;

    const departureSeconds = arrivalSeconds + dwellMinutes * 60;

    previousDepartureSeconds = departureSeconds;

    return {
      ...stop,
      stopSequence: index + 1,
      travelMinutesFromPrevious: travelMinutes,
      dwellMinutes,
      arrivalTime: secondsToGtfsTime(arrivalSeconds),
      departureTime: secondsToGtfsTime(departureSeconds),
    };
  });
};

export const regenerateTripStopTimesFromIndex = (
  stops: TripSetupStop[],
  changedIndex: number,
): TripSetupStop[] => {
  if (changedIndex < 0 || changedIndex >= stops.length) {
    return stops;
  }

  return stops.map((stop, index) => {
    if (index <= changedIndex) {
      return stop;
    }

    const previousStop = stops[index - 1];

    const previousDeparture = gtfsTimeToSeconds(
      previousStop.departureTime,
    );

    const travelMinutes = normalizePositiveNumber(
      stop.travelMinutesFromPrevious,
      DEFAULT_TRAVEL_MINUTES,
    );

    const dwellMinutes = normalizePositiveNumber(
      stop.dwellMinutes,
      DEFAULT_DWELL_MINUTES,
    );

    const arrivalSeconds = previousDeparture + travelMinutes * 60;
    const departureSeconds = arrivalSeconds + dwellMinutes * 60;

    return {
      ...stop,
      arrivalTime: secondsToGtfsTime(arrivalSeconds),
      departureTime: secondsToGtfsTime(departureSeconds),
    };
  });
};

export const updateStopArrivalAndDwell = (
  stop: TripSetupStop,
  arrivalTime: string,
  dwellMinutes = stop.dwellMinutes,
): TripSetupStop => {
  const normalizedDwellMinutes = normalizePositiveNumber(
    dwellMinutes,
    DEFAULT_DWELL_MINUTES,
  );

  if (!isValidGtfsTime(arrivalTime)) {
    return {
      ...stop,
      arrivalTime,
      dwellMinutes: normalizedDwellMinutes,
    };
  }

  const departureTime = secondsToGtfsTime(
    gtfsTimeToSeconds(arrivalTime) + normalizedDwellMinutes * 60,
  );

  return {
    ...stop,
    arrivalTime,
    departureTime,
    dwellMinutes: normalizedDwellMinutes,
  };
};

export const mapStopsToPayload = (
  stops: TripSetupStop[],
): ReplaceTripStopTimesPayload => {
  const enabledStops = stops.filter((stop) => stop.enabled);

  return {
    stopTimes: enabledStops.map((stop, index) => ({
      stopId: stop.stopId,
      stopSequence: index + 1,
      arrivalTime: stop.arrivalTime.trim(),
      departureTime: stop.departureTime.trim(),
      pickupType: stop.pickupType,
      dropOffType: stop.dropOffType,
      timepoint: stop.timepoint,
    })),
  };
};

export const createDefaultFrequencyWindow =
  (): TripSetupFrequencyWindow => ({
    clientId: createFrequencyWindowId(),
    startTime: "06:00:00",
    endTime: "09:00:00",
    headwayMinutes: 10,
    exactTimes: true,
  });

export const buildFrequencyWindows = (
  frequencies: TripFrequency[],
): TripSetupFrequencyWindow[] => {
  return frequencies.map((frequency) => ({
    clientId: createFrequencyWindowId(),
    startTime: frequency.startTime,
    endTime: frequency.endTime,
    headwayMinutes: Math.max(
      1,
      Math.round(frequency.headwaySecs / 60),
    ),
    exactTimes: Boolean(frequency.exactTimes),
  }));
};

export const mapFrequencyWindowsToPayload = (
  windows: TripSetupFrequencyWindow[],
  repeated: boolean,
): ReplaceTripFrequenciesPayload => {
  if (!repeated) {
    return {
      frequencies: [],
    };
  }

  return {
    frequencies: windows.map((window) => ({
      startTime: window.startTime.trim(),
      endTime: window.endTime.trim(),
      headwaySecs:
        normalizePositiveNumber(window.headwayMinutes, 1, false) * 60,
      exactTimes: window.exactTimes,
    })),
  };
};

const hasOverlappingFrequencyWindows = (
  windows: TripSetupFrequencyWindow[],
) => {
  const sortedWindows = [...windows].sort(
    (first, second) =>
      gtfsTimeToSeconds(first.startTime) -
      gtfsTimeToSeconds(second.startTime),
  );

  return sortedWindows.some((window, index) => {
    const nextWindow = sortedWindows[index + 1];

    if (!nextWindow) {
      return false;
    }

    return (
      gtfsTimeToSeconds(window.endTime) >
      gtfsTimeToSeconds(nextWindow.startTime)
    );
  });
};

export const validateTripSetup = (
  stops: TripSetupStop[],
  repeated: boolean,
  windows: TripSetupFrequencyWindow[],
): TripSetupValidationResult => {
  const enabledStops = stops.filter((stop) => stop.enabled);

  if (enabledStops.length < 2) {
    return {
      valid: false,
      error: "minimumStops",
    };
  }

  const hasInvalidStopTimes = enabledStops.some((stop) => {
    if (
      !isValidGtfsTime(stop.arrivalTime) ||
      !isValidGtfsTime(stop.departureTime)
    ) {
      return true;
    }

    return (
      gtfsTimeToSeconds(stop.departureTime) <
      gtfsTimeToSeconds(stop.arrivalTime)
    );
  });

  if (hasInvalidStopTimes) {
    return {
      valid: false,
      error: "invalidStopTimes",
    };
  }

  const hasInvalidStopOrder = enabledStops.some((stop, index) => {
    const nextStop = enabledStops[index + 1];

    if (!nextStop) {
      return false;
    }

    return (
      gtfsTimeToSeconds(nextStop.arrivalTime) <
      gtfsTimeToSeconds(stop.departureTime)
    );
  });

  if (hasInvalidStopOrder) {
    return {
      valid: false,
      error: "invalidStopOrder",
    };
  }

  if (!repeated) {
    return {
      valid: true,
    };
  }

  if (windows.length === 0) {
    return {
      valid: false,
      error: "frequencyRequired",
    };
  }

  const hasInvalidFrequency = windows.some((window) => {
    if (
      !isValidGtfsTime(window.startTime) ||
      !isValidGtfsTime(window.endTime)
    ) {
      return true;
    }

    if (
      gtfsTimeToSeconds(window.endTime) <=
      gtfsTimeToSeconds(window.startTime)
    ) {
      return true;
    }

    return Number(window.headwayMinutes) <= 0;
  });

  if (hasInvalidFrequency) {
    return {
      valid: false,
      error: "invalidFrequencies",
    };
  }

  if (hasOverlappingFrequencyWindows(windows)) {
    return {
      valid: false,
      error: "overlappingFrequencies",
    };
  }

  return {
    valid: true,
  };
};

export const cloneTripSetupStops = (stops: TripSetupStop[]) => {
  return stops.map((stop) => ({ ...stop }));
};

export const cloneFrequencyWindows = (
  windows: TripSetupFrequencyWindow[],
) => {
  return windows.map((window) => ({ ...window }));
};