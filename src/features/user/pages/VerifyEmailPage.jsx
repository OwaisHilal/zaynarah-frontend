// src/features/user/pages/VerifyEmailPage.jsx
// src/features/user/pages/VerifyEmailPage.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../hooks/useUser';
import { Button } from '@/components/ui/button';
import { useToast } from '@/features/ui/toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { resendEmailVerification, loading } = useUserStore();

  const token = params.get('token');

  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      setError('Invalid verification link');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      await axios.get(`${API_BASE}/auth/email/verify`, {
        params: { token },
      });

      setVerified(true);
      showToast('Email verified successfully');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed or expired');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    const ok = await resendEmailVerification();
    if (ok) {
      setResent(true);
      showToast('Verification email resent');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Verify Your Email
        </h1>

        {!verified && (
          <>
            <p className="text-gray-600 mb-6">
              Please verify your email to continue using your account.
            </p>

            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

            <Button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full mb-3"
            >
              {verifying ? 'Verifying…' : 'Verify Email'}
            </Button>

            {!resent ? (
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending…' : 'Resend Verification Email'}
              </Button>
            ) : (
              <p className="text-green-600 text-sm mt-3">
                Verification email sent. Please check your inbox.
              </p>
            )}
          </>
        )}

        {verified && (
          <p className="text-green-600">
            Email verified. Redirecting to login…
          </p>
        )}
      </div>
    </div>
  );
}
