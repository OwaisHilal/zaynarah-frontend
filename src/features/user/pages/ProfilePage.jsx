// frontend/src/features/user/pages/ProfilePage.jsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUserStore } from '../hooks/useUser';
import UserProfile from '../components/UserProfile';
import UserAddresses from '../components/UserAddresses';

export default function ProfilePage() {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Account
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Manage your personal information, security, and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64 shrink-0">
              <div className="bg-white rounded-3xl shadow-xl p-4">
                <TabsList className="flex flex-col gap-2">
                  <TabsTrigger
                    value="profile"
                    className="justify-start px-4 py-2 rounded-xl"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="addresses"
                    className="justify-start px-4 py-2 rounded-xl"
                  >
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="justify-start px-4 py-2 rounded-xl"
                  >
                    Orders
                  </TabsTrigger>
                </TabsList>
              </div>
            </aside>

            <div className="flex-1 space-y-8">
              <TabsContent value="profile" className="space-y-8">
                {user && (
                  <Card className="rounded-3xl shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Account overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Role</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {user.role}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email status</p>
                        <p
                          className={`text-sm font-medium ${
                            user.emailVerified
                              ? 'text-green-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {user.emailVerified ? 'Verified' : 'Not verified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Member since</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <UserProfile />
                </div>
              </TabsContent>

              <TabsContent value="addresses">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <UserAddresses />
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Orders
                    </h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/orders">View all orders</Link>
                    </Button>
                  </div>
                  <p className="text-gray-600">
                    Review your past purchases, track deliveries, and download
                    invoices from your orders page.
                  </p>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
