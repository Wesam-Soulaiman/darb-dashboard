import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  acquireRunsSocket,
  getRunsSocket,
  releaseRunsSocket,
} from "../../realtime/runsSocket";

import { runsQueryKeys } from "./useRuns";

import type { Run, RunsResponse, RunStatus } from "../../types/run.types";

import type {
  RunLifecycleEvent,
  RunsSocketConnectionStatus,
} from "../../types/run-realtime.types";

const SERVER_SYNC_DELAY_MS = 700;

const isValidId = (value: number): boolean => Number.isFinite(value) && value > 0;

const updateRunStatus = (run: Run, runId: number, status: RunStatus): Run => {
  if (run.id !== runId) {
    return run;
  }

  return {
    ...run,
    status,
    updatedAt: new Date().toISOString(),
  };
};

export const useRunsRealtime = (orgId: number, runIds: number[], enabled = true) => {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<RunsSocketConnectionStatus>("idle");

  const [lastError, setLastError] = useState<string | null>(null);

  const serverSyncTimerRef = useRef<number | null>(null);

  const normalizedRunIds = useMemo(() => {
    return Array.from(new Set(runIds.filter(isValidId))).sort(
      (first, second) => first - second,
    );
  }, [runIds]);

  const subscribedRunIdsRef = useRef<number[]>(normalizedRunIds);

  useEffect(() => {
    subscribedRunIdsRef.current = normalizedRunIds;
  }, [normalizedRunIds]);

  useEffect(() => {
    if (!enabled || !isValidId(orgId)) {
      setStatus("idle");
      return;
    }

    const socket = acquireRunsSocket();

    const subscribeToCurrentRuns = () => {
      subscribedRunIdsRef.current.forEach((runId) => {
        socket.emit("subscribe", {
          runId,
        });

        if (import.meta.env.DEV) {
          console.info("[runs-socket] subscribed", runId);
        }
      });
    };

    const synchronizeWithServer = () => {
      if (serverSyncTimerRef.current !== null) {
        window.clearTimeout(serverSyncTimerRef.current);
      }

      serverSyncTimerRef.current = window.setTimeout(() => {
        void queryClient.invalidateQueries({
          queryKey: runsQueryKeys.org(orgId),
          refetchType: "active",
        });

        serverSyncTimerRef.current = null;
      }, SERVER_SYNC_DELAY_MS);
    };

    const patchRunCaches = (payload: RunLifecycleEvent, nextStatus: RunStatus) => {
      queryClient.setQueriesData<Run[]>(
        {
          queryKey: runsQueryKeys.dailyRoot(orgId),
        },
        (currentRuns) => {
          if (!currentRuns) {
            return currentRuns;
          }

          return currentRuns.map((run) =>
            updateRunStatus(run, payload.runId, nextStatus),
          );
        },
      );

      queryClient.setQueriesData<RunsResponse>(
        {
          queryKey: runsQueryKeys.lists(orgId),
        },
        (currentResponse) => {
          if (!currentResponse) {
            return currentResponse;
          }

          return {
            ...currentResponse,
            data: currentResponse.data.map((run) =>
              updateRunStatus(run, payload.runId, nextStatus),
            ),
          };
        },
      );
      queryClient.setQueryData<Run>(
        runsQueryKeys.detail(orgId, payload.runId),
        (currentRun) => {
          if (!currentRun) {
            return currentRun;
          }

          return updateRunStatus(currentRun, payload.runId, nextStatus);
        },
      );

      void queryClient.invalidateQueries({
        queryKey: runsQueryKeys.statsRoot(orgId),
      });

      synchronizeWithServer();
    };

    const handleConfirmed = (payload: RunLifecycleEvent) => {
      if (import.meta.env.DEV) {
        console.info("[runs-socket] confirmed", payload);
      }

      patchRunCaches(payload, "confirmed");
    };

    const handleStarted = (payload: RunLifecycleEvent) => {
      if (import.meta.env.DEV) {
        console.info("[runs-socket] started", payload);
      }

      patchRunCaches(payload, "in_progress");
    };

    const handleCompleted = (payload: RunLifecycleEvent) => {
      if (import.meta.env.DEV) {
        console.info("[runs-socket] completed", payload);
      }

      patchRunCaches(payload, "completed");
    };

    const handleCancelled = (payload: RunLifecycleEvent) => {
      if (import.meta.env.DEV) {
        console.info("[runs-socket] cancelled", payload);
      }

      patchRunCaches(payload, "cancelled");
    };

    const handleConnect = () => {
      setStatus("connected");
      setLastError(null);

      if (import.meta.env.DEV) {
        console.info("[runs-socket] connected", socket.id);
      }

      subscribeToCurrentRuns();
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

    const handleAnyEvent = (eventName: string, ...args: unknown[]) => {
      if (!import.meta.env.DEV) {
        return;
      }

      console.debug(`[runs-socket] event: ${eventName}`, ...args);
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

    socket.onAny(handleAnyEvent);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      if (serverSyncTimerRef.current !== null) {
        window.clearTimeout(serverSyncTimerRef.current);

        serverSyncTimerRef.current = null;
      }

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.off("confirmed", handleConfirmed);
      socket.off("started", handleStarted);
      socket.off("completed", handleCompleted);
      socket.off("cancelled", handleCancelled);

      socket.off("exception", handleException);

      socket.offAny(handleAnyEvent);

      releaseRunsSocket();
    };
  }, [enabled, orgId, queryClient]);

  useEffect(() => {
    if (!enabled || !isValidId(orgId)) {
      return;
    }

    const socket = getRunsSocket();

    if (socket.connected) {
      normalizedRunIds.forEach((runId) => {
        socket.emit("subscribe", {
          runId,
        });

        if (import.meta.env.DEV) {
          console.info("[runs-socket] subscribed", runId);
        }
      });
    }

    return () => {
      if (!socket.connected) {
        return;
      }

      normalizedRunIds.forEach((runId) => {
        socket.emit("unsubscribe", {
          runId,
        });

        if (import.meta.env.DEV) {
          console.info("[runs-socket] unsubscribed", runId);
        }
      });
    };
  }, [enabled, orgId, normalizedRunIds]);

  return {
    status,
    lastError,
    isConnected: status === "connected",
  };
};
