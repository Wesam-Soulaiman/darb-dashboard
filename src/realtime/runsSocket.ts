import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "../core/auth/authStorage";

import type {
  RunsClientToServerEvents,
  RunsServerToClientEvents,
} from "../types/run-realtime.types";

export type RunsSocket = Socket<RunsServerToClientEvents, RunsClientToServerEvents>;

let socketInstance: RunsSocket | null = null;
let socketConsumers = 0;

const getSocketBaseUrl = (): string => {
  const value = import.meta.env.VITE_SOCKET_BASE_URL?.trim();

  if (!value) {
    throw new Error("Missing VITE_SOCKET_BASE_URL environment variable.");
  }

  return value.replace(/\/+$/, "");
};

const createRunsSocket = (): RunsSocket => {
  const baseUrl = getSocketBaseUrl();

  const socket: RunsSocket = io(`${baseUrl}/runs`, {
    autoConnect: false,

    transports: ["websocket"],

    auth: (callback) => {
      const accessToken = getAccessToken();

      callback({
        token: accessToken ? `Bearer ${accessToken}` : "",
      });
    },

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 5_000,
    timeout: 15_000,
  });

  return socket;
};

export const getRunsSocket = (): RunsSocket => {
  if (!socketInstance) {
    socketInstance = createRunsSocket();
  }

  return socketInstance;
};

export const acquireRunsSocket = (): RunsSocket => {
  const socket = getRunsSocket();

  socketConsumers += 1;

  if (!socket.connected && !socket.active) {
    socket.connect();
  }

  return socket;
};

export const releaseRunsSocket = (): void => {
  socketConsumers = Math.max(0, socketConsumers - 1);

  if (socketConsumers === 0 && socketInstance) {
    socketInstance.disconnect();
  }
};

export const destroyRunsSocket = (): void => {
  socketConsumers = 0;

  if (!socketInstance) {
    return;
  }

  socketInstance.removeAllListeners();
  socketInstance.disconnect();
  socketInstance = null;
};
