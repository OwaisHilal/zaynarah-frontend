import SignupForm from '../components/SignUpForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen w-full bg-gray-50 px-6 pt-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
          Create Your Account
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Sign up to get started and manage your account
        </p>

        {/* Signup Form Container */}
        <div className="rounded-2xl p-6 shadow-inner border border-gray-200 bg-white">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
