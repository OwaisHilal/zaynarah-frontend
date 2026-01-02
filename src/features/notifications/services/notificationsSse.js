// frontend/src/features/notifications/services/notificationsSse.js
let eventSource = null;
let reconnectTimeout = null;

export function connectNotificationsSSE({ token, onMessage }) {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  if (!token) return;

  const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
  const url = `${baseUrl}/notifications/stream?token=${encodeURIComponent(
    token
  )}`;

  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log('[SSE] Connection established');
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.status === 'ok') return;

      if (onMessage) {
        onMessage(data);
      }
    } catch (err) {
      console.error('[SSE] Data parse error:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.error('[SSE] Connection failed.');
    eventSource.close();
    eventSource = null;

    if (token && localStorage.getItem('token')) {
      reconnectTimeout = setTimeout(() => {
        console.log('[SSE] Retrying connection...');
        connectNotificationsSSE({ token, onMessage });
      }, 5000);
    }
  };
}

export function disconnectNotificationsSSE() {
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
