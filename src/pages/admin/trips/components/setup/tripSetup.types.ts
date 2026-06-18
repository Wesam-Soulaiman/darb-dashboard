import type {
  GtfsPickupDropOffType,
  GtfsTimepoint,
} from "../../../../../types/trip.types";

export type TripSetupStop = {
  stopId: string;
  stopName: string;
  routeOrder: number;

  enabled: boolean;
  stopSequence: number;

  arrivalTime: string;
  departureTime: string;

  travelMinutesFromPrevious: number;
  dwellMinutes: number;

  pickupType: GtfsPickupDropOffType;
  dropOffType: GtfsPickupDropOffType;
  timepoint: GtfsTimepoint;
};

export type TripSetupFrequencyWindow = {
  clientId: string;
  startTime: string;
  endTime: string;
  headwayMinutes: number;
  exactTimes: boolean;
};

export type TripSetupValidationError =
  | "minimumStops"
  | "invalidStopTimes"
  | "invalidStopOrder"
  | "frequencyRequired"
  | "invalidFrequencies"
  | "overlappingFrequencies";

export type TripSetupValidationResult = {
  valid: boolean;
  error?: TripSetupValidationError;
};
