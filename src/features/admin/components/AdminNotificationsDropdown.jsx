//frontend/src/features/admin/components/AdminNotificationsDropdown.jsx

import { useEffect } from 'react';
import { useAdminNotificationsStore } from '../stores/adminNotificationsStore';
import { Link } from 'react-router-dom';

export default function AdminNotificationsDropdown({ onClose }) {
  const { items, fetchLatest, markRead, markAllRead, loading } =
    useAdminNotificationsStore();

  useEffect(() => {
    fetchLatest();
  }, []);

  return (
    <div className="absolute right-0 mt-3 w-[360px] rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-sm font-bold text-slate-900">Notifications</span>
        <button
          onClick={markAllRead}
          className="text-[11px] font-semibold text-indigo-600 hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading && <div className="p-4 text-sm text-slate-400">Loading…</div>}

        {!loading && items.length === 0 && (
          <div className="p-4 text-sm text-slate-400">No notifications</div>
        )}

        {items.map((n) => (
          <Link
            key={n._id}
            to={n.actionUrl || '#'}
            onClick={() => {
              if (!n.readAt) markRead(n._id);
              onClose();
            }}
            className={`block px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition ${
              !n.readAt ? 'bg-indigo-50/40' : ''
            }`}
          >
            <div className="text-sm font-semibold text-slate-900">
              {n.title}
            </div>
            <div className="text-[12px] text-slate-500 mt-0.5">{n.message}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
