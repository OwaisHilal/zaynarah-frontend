// frontend/src/features/admin/hooks/useAdminGuard.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/features/user/hooks/useUser';

export default function useAdminGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, isAdmin, fetchProfile } = useUserStore();

  useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (!isAdmin()) {
      navigate('/', { replace: true });
      return;
    }
  }, [user, loading, isAdmin, navigate, location.pathname]);

  return {
    user,
    loading,
    allowed: Boolean(user && isAdmin()),
  };
}
