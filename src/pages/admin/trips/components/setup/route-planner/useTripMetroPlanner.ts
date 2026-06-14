import { useEffect, useMemo, useState } from "react";

import type { TripSetupStop } from "../tripSetup.types";
import {
  DEFAULT_DWELL_MINUTES,
  DEFAULT_TRAVEL_MINUTES,
  DEFAULT_TRIP_START_TIME,
  gtfsTimeToSeconds,
  isValidGtfsTime,
  secondsToGtfsTime,
} from "../tripSetup.utils";
import {
  ensureTimeNotBefore,
  generateAllStopTimes,
  getEffectiveDwellMinutes,
  getMinutesBetweenTimes,
  patchTripStop,
  recalculateStopsFromIndex,
  toNonNegativeInteger,
} from "./tripMetroPlanner.utils";

type UseTripMetroPlannerProps = {
  stops: TripSetupStop[];
  onChange: (stops: TripSetupStop[]) => void;
};

export const useTripMetroPlanner = ({ stops, onChange }: UseTripMetroPlannerProps) => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const [startTime, setStartTime] = useState(() => {
    const firstStopTime = stops[0]?.arrivalTime;

    return firstStopTime && isValidGtfsTime(firstStopTime)
      ? firstStopTime
      : DEFAULT_TRIP_START_TIME;
  });

  const [defaultTravelMinutes, setDefaultTravelMinutes] =
    useState(DEFAULT_TRAVEL_MINUTES);

  const [defaultDwellMinutes, setDefaultDwellMinutes] = useState(DEFAULT_DWELL_MINUTES);

  const firstStopId = stops[0]?.stopId;
  const firstStopArrivalTime = stops[0]?.arrivalTime;

  useEffect(() => {
    setStartTime(
      firstStopArrivalTime && isValidGtfsTime(firstStopArrivalTime)
        ? firstStopArrivalTime
        : DEFAULT_TRIP_START_TIME,
    );
  }, [firstStopId, firstStopArrivalTime]);

  const selectedStopIndex = useMemo(() => {
    if (!selectedStopId) {
      return null;
    }

    const index = stops.findIndex((stop) => stop.stopId === selectedStopId);

    return index >= 0 ? index : null;
  }, [selectedStopId, stops]);

  const selectedStop =
    selectedStopIndex === null ? null : (stops[selectedStopIndex] ?? null);

  useEffect(() => {
    if (selectedStopId && selectedStopIndex === null) {
      setSelectedStopId(null);
    }
  }, [selectedStopId, selectedStopIndex]);

  const enabledStopsCount = useMemo(
    () => stops.filter((stop) => stop.enabled).length,
    [stops],
  );

  const skippedStopsCount = stops.length - enabledStopsCount;

  const emitStops = (nextStops: TripSetupStop[], recalculateFromIndex?: number) => {
    if (recalculateFromIndex === undefined) {
      onChange(nextStops);
      return;
    }

    onChange(recalculateStopsFromIndex(nextStops, recalculateFromIndex));
  };

  const openStopEditor = (index: number) => {
    const stop = stops[index];

    if (!stop) {
      return;
    }

    setSelectedStopId(stop.stopId);
  };

  const closeStopEditor = () => {
    const activeElement = document.activeElement as HTMLElement | null;

    activeElement?.blur();
    setSelectedStopId(null);
  };

  const updateSelectedStop = (patch: Partial<TripSetupStop>) => {
    if (selectedStopIndex === null) {
      return;
    }

    onChange(patchTripStop(stops, selectedStopIndex, patch));
  };

  const handleGenerateTimes = () => {
    if (stops.length === 0) {
      return;
    }

    onChange(
      generateAllStopTimes(stops, startTime, defaultTravelMinutes, defaultDwellMinutes),
    );
  };

  const handleTravelMinutesChange = (index: number, minutes: number) => {
    const updatedStops = patchTripStop(stops, index, {
      travelMinutesFromPrevious: toNonNegativeInteger(minutes),
    });

    emitStops(updatedStops, index);
  };

  const handleArrivalTimeChange = (value: string) => {
    if (!selectedStop || selectedStopIndex === null) {
      return;
    }

    let normalizedArrivalTime = value;

    if (selectedStopIndex > 0) {
      const previousStop = stops[selectedStopIndex - 1];

      const previousDepartureTime = isValidGtfsTime(previousStop.departureTime)
        ? previousStop.departureTime
        : previousStop.arrivalTime;

      normalizedArrivalTime = ensureTimeNotBefore(value, previousDepartureTime);
    }

    const dwellMinutes = getEffectiveDwellMinutes(selectedStop);

    const departureTime = isValidGtfsTime(normalizedArrivalTime)
      ? secondsToGtfsTime(gtfsTimeToSeconds(normalizedArrivalTime) + dwellMinutes * 60)
      : selectedStop.departureTime;

    let travelMinutesFromPrevious = selectedStop.travelMinutesFromPrevious;

    if (selectedStopIndex > 0 && isValidGtfsTime(normalizedArrivalTime)) {
      const previousStop = stops[selectedStopIndex - 1];

      const previousDepartureTime = isValidGtfsTime(previousStop.departureTime)
        ? previousStop.departureTime
        : previousStop.arrivalTime;

      travelMinutesFromPrevious = getMinutesBetweenTimes(
        previousDepartureTime,
        normalizedArrivalTime,
        selectedStop.travelMinutesFromPrevious,
      );
    }

    const updatedStops = patchTripStop(stops, selectedStopIndex, {
      arrivalTime: normalizedArrivalTime,
      departureTime,
      dwellMinutes,
      travelMinutesFromPrevious,
    });

    emitStops(updatedStops, selectedStopIndex + 1);
  };

  const handleDepartureTimeChange = (value: string) => {
    if (!selectedStop || selectedStopIndex === null) {
      return;
    }

    const normalizedDepartureTime = ensureTimeNotBefore(value, selectedStop.arrivalTime);

    const dwellMinutes = getMinutesBetweenTimes(
      selectedStop.arrivalTime,
      normalizedDepartureTime,
      selectedStop.dwellMinutes,
    );

    const updatedStops = patchTripStop(stops, selectedStopIndex, {
      departureTime: normalizedDepartureTime,
      dwellMinutes,
    });

    emitStops(updatedStops, selectedStopIndex + 1);
  };

  const handleDwellMinutesChange = (minutes: number) => {
    if (!selectedStop || selectedStopIndex === null) {
      return;
    }

    const normalizedMinutes = toNonNegativeInteger(minutes);

    const departureTime = isValidGtfsTime(selectedStop.arrivalTime)
      ? secondsToGtfsTime(
          gtfsTimeToSeconds(selectedStop.arrivalTime) + normalizedMinutes * 60,
        )
      : selectedStop.departureTime;

    const updatedStops = patchTripStop(stops, selectedStopIndex, {
      dwellMinutes: normalizedMinutes,
      departureTime,
    });

    emitStops(updatedStops, selectedStopIndex + 1);
  };

  const handleStopEnabledChange = (enabled: boolean) => {
    if (!selectedStop || selectedStopIndex === null) {
      return;
    }

    const dwellMinutes = enabled
      ? toNonNegativeInteger(defaultDwellMinutes, DEFAULT_DWELL_MINUTES)
      : 0;

    const departureTime = isValidGtfsTime(selectedStop.arrivalTime)
      ? secondsToGtfsTime(gtfsTimeToSeconds(selectedStop.arrivalTime) + dwellMinutes * 60)
      : selectedStop.departureTime;

    const updatedStops = patchTripStop(stops, selectedStopIndex, {
      enabled,
      dwellMinutes,
      departureTime,
    });

    emitStops(updatedStops, selectedStopIndex + 1);
  };

  return {
    selectedStop,
    selectedStopIndex,
    selectedStopId,

    startTime,
    defaultTravelMinutes,
    defaultDwellMinutes,

    enabledStopsCount,
    skippedStopsCount,

    setStartTime,

    setDefaultTravelMinutes: (value: unknown) => {
      setDefaultTravelMinutes(toNonNegativeInteger(value, DEFAULT_TRAVEL_MINUTES));
    },

    setDefaultDwellMinutes: (value: unknown) => {
      setDefaultDwellMinutes(toNonNegativeInteger(value, DEFAULT_DWELL_MINUTES));
    },

    openStopEditor,
    closeStopEditor,

    updateSelectedStop,

    handleGenerateTimes,
    handleTravelMinutesChange,
    handleArrivalTimeChange,
    handleDepartureTimeChange,
    handleDwellMinutesChange,
    handleStopEnabledChange,
  };
};
