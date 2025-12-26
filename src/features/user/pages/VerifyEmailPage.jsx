// src/features/user/pages/VerifyEmailPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authClient } from '@/api/authClient';
import { useUserStore } from '../hooks/useUser';
import { Button } from '@/components/ui/button';
import { useToast } from '@/features/ui/toast';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { resendEmailVerification, loading } = useUserStore();

  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      setError('Invalid verification link');
      setVerifying(false);
      return;
    }

    let active = true;

    authClient
      .get(`/auth/email/verify?token=${token}`)
      .then(() => {
        if (!active) return;
        showToast('Email verified successfully');
        setTimeout(() => navigate('/login'), 1200);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err.response?.data?.message || 'Verification link expired or invalid'
        );
      })
      .finally(() => {
        if (active) setVerifying(false);
      });

    return () => {
      active = false;
    };
  }, [params, navigate, showToast]);

  const handleResend = async () => {
    const ok = await resendEmailVerification();
    if (ok) {
      setResent(true);
      showToast('Verification email sent');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {verifying && (
          <p className="text-gray-600 text-lg">Verifying your email…</p>
        )}

        {!verifying && !error && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified
            </h1>
            <p className="text-gray-600">Redirecting you to login…</p>
          </>
        )}

        {!verifying && error && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>

            {!resent ? (
              <Button
                onClick={handleResend}
                disabled={loading}
                className="w-full mb-3"
              >
                {loading ? 'Sending…' : 'Resend Verification Email'}
              </Button>
            ) : (
              <p className="text-green-600 mb-4">
                Verification email sent. Please check your inbox.
              </p>
            )}

            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Go to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
