// src/features/user/components/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useUserStore } from '../hooks/useUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserProfile() {
  const { user, loading, fetchProfile, logout } = useUserStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

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
      // Simulate API call
      await new Promise((res) => setTimeout(res, 500));
      fetchProfile(); // fetch latest user info

      setPassword('');
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const isModified =
    name !== user.name ||
    email !== user.email ||
    password.length > 0 ||
    profilePic;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="w-20 h-20">
            {profilePic ? (
              <AvatarImage src={profilePic} />
            ) : (
              <AvatarFallback>{name[0]}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
            {profilePic && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProfilePic(null)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <Label>Change Password</Label>
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && password.length < 8 && (
            <p className="text-sm text-red-500">
              Password should be at least 8 characters.
            </p>
          )}
        </div>

        {/* Update Button */}
        {updateError && <p className="text-red-600">{updateError}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}
        <Button
          onClick={handleProfileUpdate}
          disabled={updateLoading || !isModified}
        >
          {updateLoading ? 'Updating...' : 'Update Profile'}
        </Button>

        {/* Admin Panel */}
        {user.role === 'admin' && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">Admin Panel</h3>
            <Button variant="outline">Go to Admin Dashboard</Button>
          </div>
        )}

        {/* Logout */}
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
