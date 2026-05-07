import { createContext, useContext } from "react";

export type NotificationPermissionState =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

export type AppNotification = {
  id: string;
  title?: string;
  body?: string;
  image?: string;
  link?: string;
  receivedAt: number;
  isRead: boolean;
};

export interface NotificationContextValue {
  token: string | null;
  permission: NotificationPermissionState;
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;

  enableNotifications: () => Promise<string | null>;
  markAllAsRead: () => void;
  resetNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextValue>({
  token: null,
  permission: "default",
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  enableNotifications: async () => null,
  markAllAsRead: () => undefined,
  resetNotifications: () => undefined,
});

export function useNotification() {
  return useContext(NotificationContext);
}
