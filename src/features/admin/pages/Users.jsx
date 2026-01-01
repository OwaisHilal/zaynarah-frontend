// src/features/admin/pages/Users.jsx
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination } from '../components/Pagination';
import {
  Search,
  UserCog,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  Mail,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const PAGE_SIZE = 10;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = useCallback(async (pageNumber = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`, {
        params: {
          page: pageNumber,
          limit: PAGE_SIZE,
          ...(searchQuery ? { search: searchQuery } : {}),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = res.data;
      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Fetch users error:', err);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search, fetchUsers]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const toggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Elevate/Restrict ${user.email} to "${nextRole}"?`))
      return;

    setUpdatingId(user.id || user._id);
    try {
      await axios.put(
        `${API_BASE}/users/${user.id || user._id}/role`,
        { role: nextRole },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchUsers(page, search);
    } catch (err) {
      alert('Failed to update access level');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (user) => {
    if (
      !window.confirm(
        `Permanently delete user ${user.email}? This action is irreversible.`
      )
    )
      return;

    setDeletingId(user.id || user._id);
    try {
      await axios.delete(`${API_BASE}/users/${user.id || user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (users.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchUsers(page, search);
      }
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-600" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
              IAM Controller
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            User Directory
          </h1>
          <p className="text-slate-500 font-medium">
            Audit accounts, manage roles, and monitor growth.
          </p>
        </div>

        <div className="relative group min-w-[320px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={18}
          />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Filter by email or name..."
            className="pl-12 h-12 rounded-[16px] border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
          />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden ring-1 ring-slate-200">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">
                User Profile
              </th>
              <th className="px-4 py-4 font-black uppercase tracking-widest text-[10px]">
                Access Level
              </th>
              <th className="px-4 py-4 font-black uppercase tracking-widest text-[10px]">
                Registration Date
              </th>
              <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px] text-right">
                Administrative Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Syncing Directory...
                    </p>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => {
                const uid = u.id || u._id;
                const isAdmin = u.role === 'admin';
                return (
                  <tr
                    key={uid}
                    className="group hover:bg-slate-50/80 transition-all duration-200"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                          <AvatarImage src={u.avatar} />
                          <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-xs">
                            {u.email?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate flex items-center gap-2">
                            {u.name || 'Anonymous User'}
                            {isAdmin && (
                              <ShieldCheck
                                size={14}
                                className="text-indigo-600"
                              />
                            )}
                          </span>
                          <span className="text-xs text-slate-400 font-medium truncate flex items-center gap-1">
                            <Mail size={12} /> {u.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <Badge
                        className={cn(
                          'rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-tight',
                          isAdmin
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-50'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100'
                        )}
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                        <CalendarDays size={14} className="text-slate-300" />
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updatingId === uid}
                          onClick={() => toggleRole(u)}
                          className="h-9 rounded-xl font-bold text-xs gap-2 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          {updatingId === uid ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <UserCog size={14} />
                          )}
                          Permissions
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === uid}
                          onClick={() => deleteUser(u)}
                          className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          {deletingId === uid ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <UserIcon className="mx-auto text-slate-200" size={48} />
                    <h3 className="text-sm font-black text-slate-900">
                      No matching accounts
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      We couldn't find any users matching "{search}". Try a
                      different email address.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
