'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { forgotPassword } from '@/app/actions/auth';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('email', email);

    try {
      const result = await forgotPassword(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(result?.success || 'Password reset email sent!');
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/login"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </Link>

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
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
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-700 text-sm font-medium">{success}</p>
                <p className="text-green-600 text-xs mt-1">
                  Please check your email and spam/junk folder. The link expires in 1 hour.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
              placeholder="you@example.com"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-pink-600 hover:text-pink-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
