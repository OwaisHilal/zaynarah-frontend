// src/features/user/components/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useUserStore } from '../hooks/useUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [resent, setResent] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  if (!user)
    return <p className="text-center text-gray-500">No user logged in.</p>;

  const handleProfileUpdate = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    setSuccessMsg('');

    try {
      if (name !== user.name || email !== user.email) {
        await updateProfile({ name, email });
      }

      if (password) {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }

        await changePassword({
          oldPassword: password,
          newPassword: password,
        });

        setPassword('');
      }

      await fetchProfile();
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || err.message || 'Update failed'
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleResendVerification = async () => {
    const ok = await resendEmailVerification();
    if (ok) setResent(true);
  };

  const isModified =
    name !== user.name ||
    email !== user.email ||
    password.length > 0 ||
    profilePic;

  return (
    <Card className="max-w-2xl mx-auto bg-white/95 shadow-2xl rounded-3xl">
      <CardHeader>
        <CardTitle className="text-3xl font-serif text-center text-gray-900 mb-2">
          My Profile
        </CardTitle>
        <p className="text-center text-gray-600">
          Manage your personal info and preferences
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {needsEmailVerification && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center">
            <p className="text-sm font-medium text-amber-800 mb-2">
              Your email address is not verified
            </p>
            <p className="text-xs text-amber-700 mb-4">
              Please verify your email to unlock full account access.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                size="sm"
                onClick={handleResendVerification}
                disabled={resent}
                variant="outline"
              >
                {resent ? 'Verification Sent' : 'Resend Email'}
              </Button>

              <Button size="sm" onClick={() => navigate('/verify-email')}>
                Verify Now
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="w-24 h-24 ring-2 ring-rose-600 shadow-lg">
            {profilePic ? (
              <AvatarImage src={profilePic} />
            ) : (
              <AvatarFallback>{name?.[0] || 'U'}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="text-sm text-gray-500"
              disabled={needsEmailVerification}
            />
            {profilePic && (
              <Button
                variant="outline"
                size="sm"
                className="border-rose-600 text-rose-600 hover:bg-rose-50"
                onClick={() => setProfilePic(null)}
                disabled={needsEmailVerification}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-gray-700 font-medium">Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={needsEmailVerification}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-gray-700 font-medium">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={needsEmailVerification}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-gray-700 font-medium">Change Password</Label>
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={needsEmailVerification}
          />
          {password && password.length < 8 && (
            <p className="text-sm text-red-500">
              Password should be at least 8 characters.
            </p>
          )}
        </div>

        {updateError && <p className="text-red-600">{updateError}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}

        <Button
          onClick={handleProfileUpdate}
          disabled={updateLoading || !isModified || needsEmailVerification}
          className="w-full rounded-full px-6 py-3 font-semibold shadow-lg"
          style={{
            background: `linear-gradient(90deg, ${ROSE_GOLD}, ${GOLD})`,
            color: '#fff',
          }}
        >
          {updateLoading ? 'Updating...' : 'Update Profile'}
        </Button>

        {user.role === 'admin' && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">Admin Panel</h3>
            <Link
              to="/admin/dashboard"
              className="border-rose-600 text-rose-600 hover:bg-rose-50"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        )}

        <Button
          variant="destructive"
          className="w-full rounded-full px-6 py-3"
          onClick={logout}
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
