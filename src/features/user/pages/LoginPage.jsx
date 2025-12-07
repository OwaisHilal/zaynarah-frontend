// src/features/user/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Log in to access your account and manage your orders
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
        <LoginForm showHeader={false} />
      </div>
    </main>
  );
}
