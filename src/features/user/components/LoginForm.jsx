// frontend/src/features/user/components/LoginForm.jsx
import { useState, useEffect } from 'react';
import { useUserStore } from '../hooks/useUser';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const ROSE_GOLD = '#B76E79';
const GOLD = '#D4AF37';

export default function LoginForm({ showHeader = true }) {
  const { login, loading, error, user } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (user) navigate('/profile');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login({ email, password });

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Email */}
      <div className="flex flex-col gap-1">
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

      {/* Password */}
      <div className="flex flex-col gap-1 relative">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button
          type="button"
          className="absolute right-2 top-9 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Forgot password */}
      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-rose-600 hover:underline font-medium"
        >
          Forgot password?
        </Link>
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked)}
        />
        <Label htmlFor="rememberMe">Remember Me</Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full px-8 py-3 font-semibold"
        style={{
          background: `linear-gradient(90deg, ${ROSE_GOLD}, ${GOLD})`,
          color: '#fff',
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Social login */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <FcGoogle size={18} /> Continue with Google
      </Button>

      {/* Signup Link */}
      <p className="text-sm text-center text-gray-500 mt-2">
        Don’t have an account?{' '}
        <Link
          to="/signup"
          className="text-rose-600 hover:underline font-medium"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
