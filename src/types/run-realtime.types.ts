import type { RunLocationCoordinates, RunStatus } from "./run.types";

export type RunsSocketConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface RunLifecycleEvent {
  runId: number;
  driverId: number;
  date: string;
}

export interface RunLocationUpdatedEvent {
  runId: number;
  driverId: number;
  uuid: string;
  timestamp: string;
  velocity: number;
  coordinates: RunLocationCoordinates;
}

export interface RunStopSequenceUpdatedEvent {
  runId: number;
  driverId: number;
  currentStopSequence: number;
  passedStopId: string;
}

export interface RunDropOffRequestedEvent {
  runId: number;
  stopId: string;
  driverId: number;
}

export interface SubscribeToRunPayload {
  runId: number;
}

export interface RunSocketMessagePayload {
  content: string;
}

export interface RunLiveLocation {
  runId: number;
  driverId: number | null;
  uuid: string | null;
  timestamp: string;
  velocity: number;
  coordinates: RunLocationCoordinates;
}

export interface RunsServerToClientEvents {
  message: (payload: unknown) => void;

  confirmed: (payload: RunLifecycleEvent) => void;
  started: (payload: RunLifecycleEvent) => void;
  completed: (payload: RunLifecycleEvent) => void;
  cancelled: (payload: RunLifecycleEvent) => void;

  locationUpdated: (payload: RunLocationUpdatedEvent) => void;

  stopSequenceUpdated: (payload: RunStopSequenceUpdatedEvent) => void;

  dropOffRequested: (payload: RunDropOffRequestedEvent) => void;

  exception: (payload: unknown) => void;
}

export interface RunsClientToServerEvents {
  subscribe: (payload: SubscribeToRunPayload) => void;

  unsubscribe: (payload: SubscribeToRunPayload) => void;

  message: (
    payload: RunSocketMessagePayload,
    acknowledgement?: (response: unknown) => void,
  ) => void;
}

export type RunRealtimeStatusEvent = {
  runId: number;
  status: Extract<RunStatus, "confirmed" | "in_progress" | "completed" | "cancelled">;
};
