// src/features/admin/pages/Settings.jsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Shield, Store, Bell, Save, Loader2 } from 'lucide-react';
import { useUserStore } from '../../user/hooks/useUser'; // Using existing user hook

export default function AdminSettings() {
  const { user } = useUserStore();
  const [loading, setLoading] = React.useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    // Logic for updating settings
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          System Settings
        </h1>
        <p className="text-slate-500 font-medium">
          Control your administrative preferences and global store logic.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 rounded-2xl mb-8 border border-slate-200">
          <TabsTrigger
            value="profile"
            className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <User size={16} className="mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger
            value="store"
            className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Store size={16} className="mr-2" /> Storefront
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Shield size={16} className="mr-2" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-100">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <CardTitle className="text-xl font-black">
                Admin Identity
              </CardTitle>
              <CardDescription className="font-medium">
                Update your professional profile and avatar.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Full Name
                  </Label>
                  <Input
                    defaultValue={user?.name}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Email Address
                  </Label>
                  <Input
                    defaultValue={user?.email}
                    disabled
                    className="h-12 rounded-xl border-slate-200 bg-slate-100 font-bold opacity-60"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black px-8 h-12"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <Save size={18} className="mr-2" />
                    )}
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store">
          <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-100">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <CardTitle className="text-xl font-black">
                Store Configuration
              </CardTitle>
              <CardDescription className="font-medium">
                Define how Zaynarah operates globally.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Base Currency
                  </Label>
                  <select className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Default Tax (%)
                  </Label>
                  <Input
                    type="number"
                    defaultValue="18"
                    className="h-12 rounded-xl border-slate-200 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Shipping Fee
                  </Label>
                  <Input
                    type="number"
                    defaultValue="100"
                    className="h-12 rounded-xl border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <Bell className="text-amber-600 shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">
                    Maintenance Mode
                  </h4>
                  <p className="text-xs font-medium text-amber-700 mt-1 leading-relaxed">
                    Activating maintenance mode will disable the storefront for
                    all users except admins. Use this for major catalog updates.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg font-bold text-xs h-8"
                  >
                    Enable Maintenance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-100">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <CardTitle className="text-xl font-black">
                Security Protocol
              </CardTitle>
              <CardDescription className="font-medium">
                Manage your access credentials and session security.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 max-w-xl">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-xl font-black h-12 shadow-lg shadow-slate-200">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
