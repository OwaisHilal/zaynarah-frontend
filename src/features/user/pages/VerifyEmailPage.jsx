// frontend/src/features/user/pages/VerifyEmailPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/features/ui/toast';
import { useUserStore } from '../hooks/useUser';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    user,
    needsEmailVerification,
    resendEmailVerification,
    loading,
    fetchProfile,
  } = useUserStore();

  const token = params.get('token');
  const from = params.get('from') || '/';

  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (user && !needsEmailVerification) {
      navigate(from, { replace: true });
    }
  }, [user, needsEmailVerification, navigate, from]);

  const handleVerify = async () => {
    if (!token) {
      setError('Verification link is missing or invalid');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      await axios.get(`${API_BASE}/auth/email/verify?token=${token}`);
      await fetchProfile();

      setVerified(true);
      showToast('Email verified successfully');

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

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
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>

        {!verified && (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Please verify your email address to continue using your account.
            </p>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {token && (
              <Button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full mb-3"
              >
                {verifying ? 'Verifying…' : 'Verify Email'}
              </Button>
            )}

            {!resent ? (
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={loading}
                className="w-full"
              >
                Resend Verification Email
              </Button>
            ) : (
              <p className="text-green-600 mt-3">Verification email sent.</p>
            )}
          </>
        )}

        {verified && (
          <p className="text-green-600">Email verified. Redirecting…</p>
        )}
      </div>
    </div>
  );
}
