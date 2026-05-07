import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseEnv = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
};

Object.entries(requiredFirebaseEnv).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing Firebase env: ${key}`);
  }
});

if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) {
  throw new Error("Missing Firebase env: VITE_FIREBASE_VAPID_KEY");
}

const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

export async function isFirebaseMessagingSupported(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    return await isSupported();
  } catch (error) {
    console.error("Firebase messaging support check failed:", error);
    return false;
  }
}

export async function getMessagingInstance(): Promise<Messaging | null> {
  if (messaging) return messaging;

  const supported = await isFirebaseMessagingSupported();

  if (!supported) {
    return null;
  }

  messaging = getMessaging(app);
  return messaging;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined") return "denied";

  if (!("Notification" in window)) {
    return "denied";
  }

  return Notification.requestPermission();
}

export async function getFcmToken(
  swRegistration: ServiceWorkerRegistration,
): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!("Notification" in window)) {
    return null;
  }

  const permission = await requestNotificationPermission();

  if (permission !== "granted") {
    return null;
  }

  const messagingInstance = await getMessagingInstance();

  if (!messagingInstance) {
    return null;
  }

  try {
    const token = await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    return token || null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

export async function onForegroundMessage(
  handler: (payload: MessagePayload) => void,
): Promise<() => void> {
  const messagingInstance = await getMessagingInstance();

  if (!messagingInstance) {
    return () => {};
  }

  try {
    return onMessage(messagingInstance, handler);
  } catch (error) {
    console.error("Firebase foreground message listener failed:", error);
    return () => {};
  }
}

export function isNotificationGranted(): boolean {
  if (typeof window === "undefined") return false;

  if (!("Notification" in window)) {
    return false;
  }

  return Notification.permission === "granted";
}

export function isNotificationDenied(): boolean {
  if (typeof window === "undefined") return false;

  if (!("Notification" in window)) {
    return true;
  }

  return Notification.permission === "denied";
}
