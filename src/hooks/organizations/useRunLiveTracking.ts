import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { acquireRunsSocket, releaseRunsSocket } from "../../realtime/runsSocket";

import { runsQueryKeys } from "./useRuns";

import type { RunLocation, RunStatus } from "../../types/run.types";

import type {
  RunDropOffRequestedEvent,
  RunLifecycleEvent,
  RunLiveLocation,
  RunLocationUpdatedEvent,
  RunStopSequenceUpdatedEvent,
  RunsSocketConnectionStatus,
} from "../../types/run-realtime.types";

type UseRunLiveTrackingOptions = {
  orgId: number;
  runId: number;
  enabled?: boolean;
  initialLocation?: RunLocation;
  initialStatus?: RunStatus;
};

const isValidId = (value: number) => Number.isFinite(value) && value > 0;

export const useRunLiveTracking = ({
  orgId,
  runId,
  enabled = true,
  initialLocation,
  initialStatus,
}: UseRunLiveTrackingOptions) => {
  const queryClient = useQueryClient();

  const [connectionStatus, setConnectionStatus] =
    useState<RunsSocketConnectionStatus>("idle");

  const [lastError, setLastError] = useState<string | null>(null);

  const [location, setLocation] = useState<RunLiveLocation | null>(null);

  const [runStatus, setRunStatus] = useState<RunStatus | undefined>(initialStatus);

  const [stopSequence, setStopSequence] = useState<RunStopSequenceUpdatedEvent | null>(
    null,
  );

  const [dropOffRequest, setDropOffRequest] = useState<RunDropOffRequestedEvent | null>(
    null,
  );

  useEffect(() => {
    setRunStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (!initialLocation) {
      return;
    }

    setLocation((current) => {
      /**
       * لا نستبدل موقع Socket أحدث بموقع REST أقدم.
       */
      if (
        current &&
        new Date(current.timestamp).getTime() >
          new Date(initialLocation.timestamp).getTime()
      ) {
        return current;
      }

      return {
        runId: initialLocation.runId,
        driverId: null,
        uuid: initialLocation.id,
        timestamp: initialLocation.timestamp,
        velocity: initialLocation.velocity,
        coordinates: initialLocation.coordinates,
      };
    });
  }, [initialLocation]);

  useEffect(() => {
    if (!enabled || !isValidId(orgId) || !isValidId(runId)) {
      setConnectionStatus("idle");
      return;
    }

    const socket = acquireRunsSocket();

    const subscribe = () => {
      socket.emit("subscribe", {
        runId,
      });

      if (import.meta.env.DEV) {
        console.info("[runs-socket] subscribed", runId);
      }
    };

    const handleConnect = () => {
      setConnectionStatus("connected");
      setLastError(null);
      subscribe();
    };

    const handleDisconnect = (reason: string) => {
      setConnectionStatus("disconnected");

      if (import.meta.env.DEV) {
        console.info("[runs-socket] disconnected", reason);
      }
    };

    const handleConnectError = (error: Error) => {
      setConnectionStatus("error");
      setLastError(error.message);
    };

    const handleLocationUpdated = (payload: RunLocationUpdatedEvent) => {
      if (payload.runId !== runId) {
        return;
      }

      setLocation({
        runId: payload.runId,
        driverId: payload.driverId,
        uuid: payload.uuid,
        timestamp: payload.timestamp,
        velocity: payload.velocity,
        coordinates: payload.coordinates,
      });
    };

    const handleStopSequenceUpdated = (payload: RunStopSequenceUpdatedEvent) => {
      if (payload.runId !== runId) {
        return;
      }

      setStopSequence(payload);
    };

    const handleDropOffRequested = (payload: RunDropOffRequestedEvent) => {
      if (payload.runId !== runId) {
        return;
      }

      setDropOffRequest(payload);
    };

    const updateLifecycleStatus = (payload: RunLifecycleEvent, status: RunStatus) => {
      if (payload.runId !== runId) {
        return;
      }

      setRunStatus(status);

      void queryClient.invalidateQueries({
        queryKey: runsQueryKeys.detail(orgId, runId),
      });

      void queryClient.invalidateQueries({
        queryKey: runsQueryKeys.stats(orgId),
      });
    };

    const handleConfirmed = (payload: RunLifecycleEvent) => {
      updateLifecycleStatus(payload, "confirmed");
    };

    const handleStarted = (payload: RunLifecycleEvent) => {
      updateLifecycleStatus(payload, "in_progress");
    };

    const handleCompleted = (payload: RunLifecycleEvent) => {
      updateLifecycleStatus(payload, "completed");
    };

    const handleCancelled = (payload: RunLifecycleEvent) => {
      updateLifecycleStatus(payload, "cancelled");
    };

    setConnectionStatus(socket.connected ? "connected" : "connecting");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.on("locationUpdated", handleLocationUpdated);
    socket.on("stopSequenceUpdated", handleStopSequenceUpdated);
    socket.on("dropOffRequested", handleDropOffRequested);

    socket.on("confirmed", handleConfirmed);
    socket.on("started", handleStarted);
    socket.on("completed", handleCompleted);
    socket.on("cancelled", handleCancelled);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      if (socket.connected) {
        socket.emit("unsubscribe", {
          runId,
        });
      }

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.off("locationUpdated", handleLocationUpdated);
      socket.off("stopSequenceUpdated", handleStopSequenceUpdated);
      socket.off("dropOffRequested", handleDropOffRequested);

      socket.off("confirmed", handleConfirmed);
      socket.off("started", handleStarted);
      socket.off("completed", handleCompleted);
      socket.off("cancelled", handleCancelled);

      releaseRunsSocket();
    };
  }, [enabled, orgId, queryClient, runId]);

  return {
    connectionStatus,
    lastError,
    location,
    runStatus,
    stopSequence,
    dropOffRequest,
  };
};
