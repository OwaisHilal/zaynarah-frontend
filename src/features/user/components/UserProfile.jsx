// frontend/src/features/user/components/UserProfile.jsx
import { useEffect, useState } from 'react';
import { useUserStore } from '../hooks/useUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';

const ROSE_GOLD = '#B76E79';
const GOLD = '#D4AF37';

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
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  if (loading)
    return <p className="text-center text-gray-500">Loading profile…</p>;

  if (!user)
    return <p className="text-center text-gray-500">No user logged in.</p>;

  const nameChanged = name !== user.name;

  const passwordValid =
    oldPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleProfileSave = async () => {
    setError('');
    setSuccess('');
    setSavingProfile(true);
    try {
      await updateProfile({ name });
      await fetchProfile();
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');
    setSavingPassword(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    const ok = await resendEmailVerification();
    if (ok) setResent(true);
  };

  return (
    <div className="flex flex-col gap-10">
      {needsEmailVerification && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-4">
          <p className="text-sm font-medium text-amber-800">
            Email verification pending
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Verify your email to enable all account features
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResendVerification}
              disabled={resent}
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
          <CardTitle className="text-lg font-semibold text-gray-900">
            Identity
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="grid gap-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-1">
            <Label>Email</Label>
            <Input value={user.email} disabled />
            <p className="text-xs text-gray-500">
              Email is your account identifier and cannot be changed
            </p>
          </div>

          <Button
            disabled={!nameChanged || savingProfile}
            onClick={handleProfileSave}
            className="mt-2 rounded-full px-6 py-3 font-semibold"
            style={{
              background: `linear-gradient(90deg, ${ROSE_GOLD}, ${GOLD})`,
              color: '#fff',
            }}
          >
            {savingProfile ? 'Saving…' : 'Save changes'}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="rounded-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Security
          </CardTitle>
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
            onClick={handlePasswordChange}
            className="rounded-full px-6 py-3"
          >
            {savingPassword ? 'Updating…' : 'Update password'}
          </Button>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {user.role === 'admin' && (
        <Card className="rounded-2xl border bg-gray-50">
          <CardContent className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium text-gray-900">Admin access</p>
              <p className="text-sm text-gray-600">
                Manage products, orders, and analytics
              </p>
            </div>
            <Link to="/admin/dashboard" className="text-rose-600 font-medium">
              Open dashboard
            </Link>
          </CardContent>
        </Card>
      )}

      <Button
        variant="destructive"
        className="rounded-full px-6 py-3"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
}
