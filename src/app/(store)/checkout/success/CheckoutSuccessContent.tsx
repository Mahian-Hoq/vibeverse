'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail } from 'lucide-react';

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="max-w-2xl w-full">
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-2xl opacity-50"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Title and Message */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been received and is being prepared.
          </p>
        </div>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-2">
            <p className="text-sm text-gray-600 font-medium">ORDER ID</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 font-mono break-all">{orderId}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">What Happens Next?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="bg-blue-50 rounded-lg p-4 text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Confirmation</p>
                <p className="text-sm text-gray-600 mt-1">Check your WhatsApp for order confirmation</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-purple-50 rounded-lg p-4 text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Preparation</p>
                <p className="text-sm text-gray-600 mt-1">Your items are being packed with care</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-yellow-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>Our team will contact you via WhatsApp with delivery updates</li>
            <li>Delivery typically takes 2-3 business days</li>
            <li>Save your Order ID for reference</li>
            <li>If you selected bKash, ensure payment is sent within 2 hours</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border-2 border-gray-300 hover:border-pink-600 text-gray-900 hover:text-pink-600 font-semibold rounded-lg transition-all duration-200 text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-gray-600 pt-4">
          Have questions?{' '}
          <a href="#" className="text-pink-600 hover:text-pink-700 font-semibold">
            Contact our support
          </a>
        </p>
      </div>
    </div>
  );
}
