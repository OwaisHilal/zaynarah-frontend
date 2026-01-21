// frontend/src/stores/notifications/__tests__/notifications.ui.store.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationsUIStore } from '../notifications.ui.store';

const resetUI = () => {
  useNotificationsUIStore.setState({ dropdownOpen: false });
};

describe('notifications.ui.store — baseline behavior', () => {
  beforeEach(() => {
    resetUI();
  });

  it('starts closed', () => {
    expect(useNotificationsUIStore.getState().dropdownOpen).toBe(false);
  });

  it('openDropdown opens dropdown', () => {
    useNotificationsUIStore.getState().openDropdown();
    expect(useNotificationsUIStore.getState().dropdownOpen).toBe(true);
  });

  it('closeDropdown closes dropdown', () => {
    useNotificationsUIStore.getState().openDropdown();
    useNotificationsUIStore.getState().closeDropdown();
    expect(useNotificationsUIStore.getState().dropdownOpen).toBe(false);
  });
});
