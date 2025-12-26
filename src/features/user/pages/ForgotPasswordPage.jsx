// src/features/user/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/api/authClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/features/ui/toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const value = email.trim();

    if (!value) {
      setError('Please enter your email');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);
      await authClient.post('/auth/password/reset/request', { email: value });
      setSubmitted(true);
      showToast('If the email exists, a reset link has been sent');
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Forgot Password
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Enter your email and we’ll send you a password reset link
            </p>

            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>

            <button
              onClick={() => navigate('/login')}
              className="mt-4 text-sm text-gray-500 hover:underline block mx-auto"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              If an account exists with that email, you’ll receive a password
              reset link shortly.
            </p>

            <Button onClick={() => navigate('/login')} className="w-full">
              Back to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
