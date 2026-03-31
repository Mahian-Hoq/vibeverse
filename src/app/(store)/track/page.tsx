'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function TrackSearchPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalized = orderId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (normalized.length !== 8) {
      setError('Please enter a valid 8-character Order ID.');
      return;
    }

    setError('');
    router.push(`/track/${normalized}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 px-4">
      <div className="max-w-3xl mx-auto py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-xl mx-auto pb-16 sm:pb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <Search className="w-7 h-7 text-pink-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Track Your Order</h1>
            <p className="mt-2 text-gray-600">
              Enter your 8-character Order ID from the success page.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="order-id" className="block text-sm font-semibold text-gray-900">
              8-character Order ID
            </label>
            <input
              id="order-id"
              type="text"
              inputMode="text"
              autoComplete="off"
              maxLength={8}
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value.toUpperCase());
                if (error) setError('');
              }}
              placeholder="e.g. 5ADAFD0F"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-pink-600 focus:outline-none transition-colors duration-200 font-mono tracking-widest uppercase"
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Track Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
