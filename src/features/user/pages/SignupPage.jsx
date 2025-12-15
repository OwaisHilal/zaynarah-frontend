// src/features/user/pages/SignupPage.jsx
import SignUpForm from '../components/SignUpForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Sign up to get started and manage your account
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
        <SignUpForm showHeader={false} />
      </div>
    </div>
  );
}
