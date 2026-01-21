// frontend/src/stores/notifications/__tests__/notifications.store.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationsDomainStore } from '../notifications.store';

const resetStore = () => {
  useNotificationsDomainStore.setState({
    items: [],
    page: 1,
    hasMore: true,
    hydrated: false,
  });
};

const makeNotification = (id, read = false) => ({
  _id: id,
  message: `n-${id}`,
  readAt: read ? new Date().toISOString() : null,
});

describe('notifications.store — baseline behavior', () => {
  beforeEach(() => {
    resetStore();
  });

  it('hydrates with first page deterministically', () => {
    const items = Array.from({ length: 20 }, (_, i) =>
      makeNotification(`n${i}`)
    );

    useNotificationsDomainStore.getState().hydrate(items);

    const state = useNotificationsDomainStore.getState();
    expect(state.items.length).toBe(20);
    expect(state.page).toBe(2);
    expect(state.hasMore).toBe(true);
    expect(state.hydrated).toBe(true);
  });

  it('hydrate with fewer than limit disables hasMore', () => {
    useNotificationsDomainStore.getState().hydrate([makeNotification('n1')]);

    expect(useNotificationsDomainStore.getState().hasMore).toBe(false);
  });

  it('append concatenates and advances page', () => {
    useNotificationsDomainStore.getState().hydrate([makeNotification('n1')]);

    useNotificationsDomainStore
      .getState()
      .append([makeNotification('n2'), makeNotification('n3')]);

    const state = useNotificationsDomainStore.getState();
    expect(state.items.map((n) => n._id)).toEqual(['n1', 'n2', 'n3']);
    expect(state.page).toBe(3);
  });

  it('append disables hasMore when page is short', () => {
    useNotificationsDomainStore.getState().append([makeNotification('n1')]);

    expect(useNotificationsDomainStore.getState().hasMore).toBe(false);
  });

  it('insertFromSSE prepends new notification', () => {
    useNotificationsDomainStore.getState().hydrate([makeNotification('n1')]);

    useNotificationsDomainStore
      .getState()
      .insertFromSSE(makeNotification('n2'));

    expect(useNotificationsDomainStore.getState().items[0]._id).toBe('n2');
  });

  it('insertFromSSE ignores duplicates', () => {
    useNotificationsDomainStore.getState().hydrate([makeNotification('n1')]);

    useNotificationsDomainStore
      .getState()
      .insertFromSSE(makeNotification('n1'));

    expect(useNotificationsDomainStore.getState().items.length).toBe(1);
  });

  it('markOneRead marks exactly one item', () => {
    useNotificationsDomainStore
      .getState()
      .hydrate([makeNotification('n1'), makeNotification('n2')]);

    useNotificationsDomainStore.getState().markOneRead('n1');

    const [a, b] = useNotificationsDomainStore.getState().items;
    expect(a.readAt).not.toBe(null);
    expect(b.readAt).toBe(null);
  });

  it('markAllRead marks all unread items', () => {
    useNotificationsDomainStore
      .getState()
      .hydrate([makeNotification('n1'), makeNotification('n2', true)]);

    useNotificationsDomainStore.getState().markAllRead();

    for (const n of useNotificationsDomainStore.getState().items) {
      expect(n.readAt).not.toBe(null);
    }
  });

  it('unreadCount reflects current store state', () => {
    useNotificationsDomainStore
      .getState()
      .hydrate([
        makeNotification('n1'),
        makeNotification('n2', true),
        makeNotification('n3'),
      ]);

    expect(useNotificationsDomainStore.getState().unreadCount()).toBe(2);
  });

  it('reset restores initial state', () => {
    useNotificationsDomainStore.getState().hydrate([makeNotification('n1')]);

    useNotificationsDomainStore.getState().reset();

    const state = useNotificationsDomainStore.getState();
    expect(state.items).toEqual([]);
    expect(state.page).toBe(1);
    expect(state.hasMore).toBe(true);
    expect(state.hydrated).toBe(false);
  });
});
