// src/features/admin/pages/Users.jsx
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

      // Backend returns { users: [...], totalPages: X, page: X }
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
    if (!window.confirm(`Change role of ${user.email} to "${nextRole}"?`))
      return;

    setUpdatingId(user.id || user._id);
    try {
      await axios.put(
        `${API_BASE}/users/${user.id || user._id}/role`,
        { role: nextRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchUsers(page, search);
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete user ${user.email}? This cannot be undone.`))
      return;

    setDeletingId(user.id || user._id);
    try {
      await axios.delete(`${API_BASE}/users/${user.id || user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-500 italic">
        Loading users...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Users</h1>
          <p className="text-sm text-neutral-500">
            Manage registered users and roles
          </p>
        </div>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by email…"
          className="w-64 border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>

      <Card className="border border-neutral-200 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id || u._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{u.role}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={updatingId === (u.id || u._id)}
                      onClick={() => toggleRole(u)}
                    >
                      {updatingId === (u.id || u._id)
                        ? 'Updating…'
                        : 'Toggle role'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      disabled={deletingId === (u.id || u._id)}
                      onClick={() => deleteUser(u)}
                    >
                      {deletingId === (u.id || u._id) ? 'Deleting…' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-neutral-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-neutral-600 px-2 py-1">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
