// src/features/user/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-6 py-10">
      <Card className="w-full max-w-lg p-10 rounded-3xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Log in to access your dashboard and manage your projects
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl p-6 shadow-inner border border-gray-200 bg-white">
          <LoginForm />
        </div>

        {/* Optional: Forgot password or extra links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Don’t have an account?{' '}
            <Button variant="link" asChild>
              <a href="/signup">Sign Up</a>
            </Button>
          </p>
        </div>
      </Card>
    </main>
  );
}
