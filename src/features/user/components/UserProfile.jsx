// frontend/src/features/user/components/UserProfile.jsx
import { useEffect, useState } from 'react';
import { useUserStore } from '../hooks/useUser';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const ROSE_GOLD = '#B76E79';
const GOLD = '#D4AF37';

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

export default function UserProfile() {
  const {
    user,
    loading,
    fetchProfile,
    updateProfile,
    changePassword,
    logout,
    resendEmailVerification,
    needsEmailVerification,
  } = useUserStore();

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (user) setName(user.name || '');
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const token = getToken();
    if (!token) return;

    const loadSessions = async () => {
      setLoadingSessions(true);
      try {
        const res = await axios.get(`${API_BASE}/auth/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data.sessions || []);
        setCurrentSessionId(res.data.currentSessionId);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoadingSessions(false);
      }
    };

    loadSessions();
  }, [user, logout]);

  if (loading) return <p className="text-center text-gray-500">Loading…</p>;
  if (!user) return null;

  const passwordValid =
    oldPassword && newPassword.length >= 8 && newPassword === confirmPassword;

  const revokeSession = async (id) => {
    const token = getToken();
    if (!token) return;

    await axios.delete(`${API_BASE}/auth/sessions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSessions((prev) => prev.filter((s) => s._id !== id));
  };

  const revokeAllOthers = async () => {
    const token = getToken();
    if (!token) return;

    await axios.delete(`${API_BASE}/auth/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const remaining = sessions.find((s) => s._id === currentSessionId);
    setSessions(remaining ? [remaining] : []);
  };

  return (
    <div className="flex flex-col gap-10">
      {needsEmailVerification && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-4">
          <p className="text-sm font-medium text-amber-800">
            Email verification pending
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Verify your email to unlock full account access
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={resent}
              onClick={async () => {
                if (await resendEmailVerification()) setResent(true);
              }}
            >
              {resent ? 'Email sent' : 'Resend verification'}
            </Button>
            <Button size="sm" onClick={() => navigate('/verify-email')}>
              Verify now
            </Button>
          </div>
        </div>
      )}

      <Card className="rounded-3xl shadow-xl">
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <Button
            disabled={name === user.name || savingProfile}
            onClick={async () => {
              setError('');
              setSuccess('');
              setSavingProfile(true);
              try {
                await updateProfile({ name });
                await fetchProfile();
                setSuccess('Profile updated');
              } catch {
                setError('Failed to update profile');
              } finally {
                setSavingProfile(false);
              }
            }}
            className="rounded-full"
            style={{
              background: `linear-gradient(90deg, ${ROSE_GOLD}, ${GOLD})`,
              color: '#fff',
            }}
          >
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="rounded-3xl shadow-xl">
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSessions && (
            <p className="text-sm text-gray-500">Loading sessions…</p>
          )}

          {sessions.map((s) => {
            const isCurrent = s._id === currentSessionId;

            return (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {s.userAgent || 'Unknown device'}
                  </p>
                  <p className="text-xs text-gray-500">
                    IP {s.ip || '—'} · Last active{' '}
                    {new Date(s.lastSeenAt).toLocaleString()}
                  </p>
                </div>

                {isCurrent ? (
                  <span className="text-xs font-medium text-green-600">
                    This device
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => revokeSession(s._id)}
                  >
                    Log out
                  </Button>
                )}
              </div>
            );
          })}

          {sessions.length > 1 && (
            <Button variant="destructive" onClick={revokeAllOthers}>
              Log out all other sessions
            </Button>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card className="rounded-3xl shadow-xl">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="outline"
            disabled={!passwordValid || savingPassword}
            onClick={async () => {
              setError('');
              setSuccess('');
              setSavingPassword(true);
              try {
                await changePassword({ oldPassword, newPassword });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setSuccess('Password updated');
              } catch {
                setError('Password update failed');
              } finally {
                setSavingPassword(false);
              }
            }}
          >
            Update password
          </Button>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {user.role === 'admin' && (
        <Card className="border bg-gray-50">
          <CardContent className="flex justify-between p-4">
            <span>Admin access</span>
            <Link to="/admin/dashboard">Dashboard</Link>
          </CardContent>
        </Card>
      )}

      <Button variant="destructive" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
