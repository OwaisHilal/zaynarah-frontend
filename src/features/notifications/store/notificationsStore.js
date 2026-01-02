// frontend/src/features/notifications/store/notificationsStore.js
import { create } from 'zustand';

export const useNotificationsStore = create((set) => ({
  dropdownOpen: false,
  openDropdown: () => set({ dropdownOpen: true }),
  closeDropdown: () => set({ dropdownOpen: false }),
}));
