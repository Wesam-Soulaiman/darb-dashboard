import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MessagePayload } from "firebase/messaging";

import { getFcmToken, onForegroundMessage } from "../firebase";
import {
  NotificationContext,
  type AppNotification,
  type NotificationPermissionState,
} from "../contexts/NotificationContext";

type NotificationProviderProps = {
  children: ReactNode;
};

const MAX_NOTIFICATIONS = 50;

function getPermissionState(): NotificationPermissionState {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return "unsupported";

  return Notification.permission;
}

function createNotificationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function mapPayloadToNotification(
  payload: MessagePayload,
): AppNotification | null {
  const title = payload.notification?.title || payload.data?.title;
  const body = payload.notification?.body || payload.data?.body;
  const image = payload.notification?.image || payload.data?.image;
  const link = payload.data?.link;

  if (!title && !body) return null;

  return {
    id: createNotificationId(),
    title,
    body,
    image,
    link,
    receivedAt: Date.now(),
    isRead: false,
  };
}

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermissionState>(getPermissionState);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const enableNotifications = useCallback(async () => {
    try {
      setIsLoading(true);

      if (typeof window === "undefined") {
        setPermission("unsupported");
        setToken(null);
        return null;
      }

      if (!("Notification" in window)) {
        setPermission("unsupported");
        setToken(null);
        return null;
      }

      if (!("serviceWorker" in navigator)) {
        setPermission("unsupported");
        setToken(null);
        return null;
      }

      const nextPermission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        setToken(null);
        return null;
      }

      const swRegistration = await navigator.serviceWorker.ready;
      const fcmToken = await getFcmToken(swRegistration);

      setToken(fcmToken);

      return fcmToken;
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPermission(getPermissionState());

    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    async function loadExistingToken() {
      try {
        const swRegistration = await navigator.serviceWorker.ready;
        const fcmToken = await getFcmToken(swRegistration);

        if (!cancelled) {
          setToken(fcmToken);
        }
      } catch (error) {
        console.error("Failed to load FCM token:", error);

        if (!cancelled) {
          setToken(null);
        }
      }
    }

    loadExistingToken();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function registerForegroundListener() {
      unsubscribe = await onForegroundMessage((payload) => {
        if (cancelled) return;

        const notification = mapPayloadToNotification(payload);
        if (!notification) return;

        setNotifications((prev) =>
          [notification, ...prev].slice(0, MAX_NOTIFICATIONS),
        );
      });
    }

    registerForegroundListener();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  }, []);

  const resetNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length;
  }, [notifications]);

  const value = useMemo(
    () => ({
      token,
      permission,
      notifications,
      unreadCount,
      isLoading,
      enableNotifications,
      markAllAsRead,
      resetNotifications,
    }),
    [
      token,
      permission,
      notifications,
      unreadCount,
      isLoading,
      enableNotifications,
      markAllAsRead,
      resetNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}