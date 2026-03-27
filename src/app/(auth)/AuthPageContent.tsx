'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, signUp } from '@/app/actions/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPageContent() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccess(message);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData);
      } else {
        result = await signIn(formData);
      }

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.success && result?.redirectUrl) {
        // Use window.location.href for reliable full-page redirect
        window.location.href = result.redirectUrl;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo and Branding */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image src="/icon.png" alt="VibeVerse Icon" width={48} height={48} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            VibeVerse
          </h1>
        </div>
        <p className="text-gray-600 mb-2">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>
        <p className="text-sm text-gray-500">
          {isSignUp
            ? 'Join our community of fashion enthusiasts'
            : 'Sign in to access your account'}
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:text-gray-400 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link (only on sign in) */}
        {!isSignUp && (
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
              Forgot password?
            </Link>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </>
          ) : (
            <>{isSignUp ? 'Create Account' : 'Sign In'}</>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Toggle Form */}
        <p className="text-center text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
            }}
            disabled={isLoading}
            className="text-pink-600 hover:text-pink-700 font-bold transition-colors disabled:text-gray-400"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </form>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm mt-6">
        By continuing, you agree to our{' '}
        <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
          Privacy Policy
        </a>
      </p>

      {/* Back to Home */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
