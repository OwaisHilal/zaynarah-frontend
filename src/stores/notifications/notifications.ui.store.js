// src/stores/notifications/notifications.ui.store.js
import { create } from 'zustand';

export const useNotificationsUIStore = create((set) => ({
  dropdownOpen: false,
  openDropdown: () => set({ dropdownOpen: true }),
  closeDropdown: () => set({ dropdownOpen: false }),
}));
