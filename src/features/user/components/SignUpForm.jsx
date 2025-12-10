// src/features/user/components/SignUpForm.jsx
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

export default function SignUpForm({ showHeader = true }) {
  const { signup, loading, error, user } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  // Redirect to profile on successful signup
  useEffect(() => {
    if (user) navigate('/profile');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    await signup({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

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

      {/* Terms */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="agreeTerms"
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(checked)}
        />
        <Label htmlFor="agreeTerms">I agree to the Terms and Conditions</Label>
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
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>

      {/* Social login */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <FcGoogle size={18} /> Continue with Google
      </Button>

      {/* Login Link */}
      <p className="text-sm text-center text-gray-500 mt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-rose-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </form>
  );
}
