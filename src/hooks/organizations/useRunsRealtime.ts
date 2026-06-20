import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { acquireRunsSocket, releaseRunsSocket } from "../../realtime/runsSocket";

import { runsQueryKeys } from "./useRuns";

import type {
  RunLifecycleEvent,
  RunsSocketConnectionStatus,
} from "../../types/run-realtime.types";

const isValidId = (value: number): boolean => Number.isFinite(value) && value > 0;

export const useRunsRealtime = (orgId: number, enabled = true) => {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<RunsSocketConnectionStatus>("idle");

  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !isValidId(orgId)) {
      setStatus("idle");
      return;
    }

    const socket = acquireRunsSocket();

    const refreshRuns = (eventName: string, payload: RunLifecycleEvent) => {
      if (import.meta.env.DEV) {
        console.info(`[runs-socket] ${eventName}`, payload);
      }

      void queryClient.invalidateQueries({
        queryKey: runsQueryKeys.org(orgId),
      });
    };

    const handleConfirmed = (payload: RunLifecycleEvent) => {
      refreshRuns("confirmed", payload);
    };

    const handleStarted = (payload: RunLifecycleEvent) => {
      refreshRuns("started", payload);
    };

    const handleCompleted = (payload: RunLifecycleEvent) => {
      refreshRuns("completed", payload);
    };

    const handleCancelled = (payload: RunLifecycleEvent) => {
      refreshRuns("cancelled", payload);
    };

    const handleConnect = () => {
      setStatus("connected");
      setLastError(null);

      if (import.meta.env.DEV) {
        console.info("[runs-socket] connected", socket.id);
      }
    };

    const handleDisconnect = (reason: string) => {
      setStatus("disconnected");

      if (import.meta.env.DEV) {
        console.info("[runs-socket] disconnected", reason);
      }
    };

    const handleConnectError = (error: Error) => {
      setStatus("error");
      setLastError(error.message);

      console.error("[runs-socket] connect_error", error);
    };

    const handleException = (payload: unknown) => {
      console.error("[runs-socket] exception", payload);
    };

    setStatus(socket.connected ? "connected" : "connecting");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.on("confirmed", handleConfirmed);
    socket.on("started", handleStarted);
    socket.on("completed", handleCompleted);
    socket.on("cancelled", handleCancelled);

    socket.on("exception", handleException);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.off("confirmed", handleConfirmed);
      socket.off("started", handleStarted);
      socket.off("completed", handleCompleted);
      socket.off("cancelled", handleCancelled);

      socket.off("exception", handleException);

      releaseRunsSocket();
    };
  }, [enabled, orgId, queryClient]);

  return {
    status,
    lastError,
    isConnected: status === "connected",
  };
};
