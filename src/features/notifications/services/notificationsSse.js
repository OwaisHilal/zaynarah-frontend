// frontend/src/features/notifications/services/notificationsSse.js
let eventSource = null;
let reconnectTimeout = null;
let activeToken = null;

export function connectNotificationsSSE({ token, onMessage }) {
  if (!token) return;
  if (eventSource && activeToken === token) return;

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

  eventSource.addEventListener('notification:new', (event) => {
    try {
      const raw = JSON.parse(event.data);

      const normalized = {
        ...raw,
        _id: raw._id || raw.id,
      };

      if (onMessage && activeToken === token) {
        onMessage({
          type: 'notification:new',
          payload: normalized,
        });
      }
    } catch (err) {
      console.error('[SSE] Parse error:', err);
    }
  });

  eventSource.addEventListener('connected', () => {});

  eventSource.onerror = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    if (activeToken !== token) return;

    if (!localStorage.getItem('token') && !sessionStorage.getItem('token'))
      return;

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
