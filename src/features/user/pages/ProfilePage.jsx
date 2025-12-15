// src/features/user/pages/ProfilePage.jsx
import UserProfile from '../components/UserProfile';
import UserOrders from '../components/UserOrders';
import UserAddresses from '../components/UserAddresses';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 gap-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Manage your account, track your orders, and customize your Zaynarah
            experience
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <UserProfile />
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
          <UserOrders />
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">My Addresses</h2>
          <UserAddresses />
        </div>
      </div>
    </div>
  );
}
