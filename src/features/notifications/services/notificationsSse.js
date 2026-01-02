//frontend/src/features/notifications/services/notificationsSse.js

let eventSource = null;

export function connectNotificationsSSE({ token, onMessage }) {
  if (!token || eventSource) return;

  const url =
    `${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}` +
    `/notifications/stream`;

  eventSource = new EventSource(url, {
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      /* ignore */
    }
  };

  eventSource.onerror = () => {
    eventSource?.close();
    eventSource = null;

    setTimeout(() => {
      connectNotificationsSSE({ token, onMessage });
    }, 3000);
  };
}

export function disconnectNotificationsSSE() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}
