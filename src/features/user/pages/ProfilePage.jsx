/* frontend/src/features/user/pages/ProfilePage.jsx */
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfile from '../components/UserProfile';
import UserAddresses from '../components/UserAddresses';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 gap-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <UserProfile />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">My Orders</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/orders">View all</Link>
            </Button>
          </div>

          <p className="text-gray-600">
            View your complete order history, download invoices, and track
            deliveries from your orders page.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">My Addresses</h2>
          <UserAddresses />
        </div>
      </div>
    </div>
  );
}
