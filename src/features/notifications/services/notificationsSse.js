// frontend/src/features/notifications/services/notificationsSse.js
let eventSource = null;
let reconnectTimeout = null;
let activeToken = null;

export function connectNotificationsSSE({ token, onMessage }) {
  // Hard stop if token is missing
  if (!token) return;

  // If same token already connected, do nothing
  if (eventSource && activeToken === token) return;

  // Cleanup any existing connection
  disconnectNotificationsSSE();

  activeToken = token;

  const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
  const url = `${baseUrl}/notifications/stream?token=${encodeURIComponent(
    token
  )}`;

  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log('[SSE] Connected');
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data?.status === 'ok') return;

      if (onMessage && activeToken === token) {
        onMessage(data);
      }
    } catch (err) {
      console.error('[SSE] Parse error:', err);
    }
  };

  eventSource.onerror = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    // ❗️Critical guard: do NOT reconnect if token changed or removed
    if (activeToken !== token) return;
    if (!localStorage.getItem('token')) return;

    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null;
      connectNotificationsSSE({ token, onMessage });
    }, 5000);
  };
}

export function disconnectNotificationsSSE() {
  activeToken = null;

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log('[SSE] Disconnected');
  }
}
