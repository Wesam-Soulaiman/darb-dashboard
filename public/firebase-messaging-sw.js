importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCVa6P5V6-gcUEtjSXXQbmGpXqGOQm2zs4",
  authDomain: "public-transportation-f5305.firebaseapp.com",
  projectId: "public-transportation-f5305",
  storageBucket: "public-transportation-f5305.firebasestorage.app",
  messagingSenderId: "722035475138",
  appId: "1:722035475138:web:93245cc2b7544834b1315b",
});

const messaging = firebase.messaging();

const getTitle = (payload) => {
  return payload?.notification?.title || payload?.data?.title || "New Notification";
};

const getBody = (payload) => {
  return payload?.notification?.body || payload?.data?.body || "";
};

const getLink = (payload) => {
  const link = payload?.data?.link || "/";
  return new URL(link, self.location.origin).href;
};

messaging.onBackgroundMessage((payload) => {
  const title = getTitle(payload);
  const body = getBody(payload);
  const link = getLink(payload);

  self.registration.showNotification(title, {
    body,
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: {
      link,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.link || self.location.origin;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          const isSameOrigin = client.url.startsWith(self.location.origin);

          if (isSameOrigin && "focus" in client) {
            if ("navigate" in client) {
              client.navigate(url);
            }

            return client.focus();
          }
        }

        return clients.openWindow(url);
      }),
  );
});
