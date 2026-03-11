'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useHydration } from '@/hooks/useHydration';

const SHIPPING_COST = 5.0;

export default function CartPage() {
  const isHydrated = useHydration();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const subtotal = getTotalPrice();
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  // Loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Empty Cart Container */}
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-2xl opacity-50"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-pink-600" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Your cart is feeling a little empty.
              </h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Discover the perfect accessories to elevate your vibe. Browse our latest collections and add some style to your cart.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 hover:border-pink-600 text-gray-900 hover:text-pink-600 font-semibold rounded-lg transition-all duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart Page with Items
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Main Cart Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            You have{' '}
            <span className="font-semibold text-gray-900">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>{' '}
            in your cart
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Cart Items List */}
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-4 sm:gap-6 p-4 sm:p-6 ${
                    index !== items.length - 1 ? 'border-b border-gray-200' : ''
                  } hover:bg-gray-50 transition-colors duration-200`}
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow flex flex-col justify-between">
                    {/* Title and Price */}
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors duration-200 line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls and Remove */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Subtotal (visible on desktop) */}
                  <div className="hidden sm:flex flex-col justify-center items-end">
                    <p className="text-sm text-gray-600 mb-2">Subtotal</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Order Summary (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-24 p-6 space-y-6">
              {/* Summary Title */}
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Summary Details */}
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                {/* Discount (placeholder for future use) */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping Link */}
              <Link
                href="/shop"
                className="w-full inline-flex items-center justify-center px-6 py-2 border-2 border-gray-300 hover:border-pink-600 text-gray-900 hover:text-pink-600 font-semibold rounded-lg transition-all duration-200"
              >
                Continue Shopping
              </Link>

              {/* Trust Badge */}
              <div className="bg-green-50 rounded-lg p-4 text-center space-y-2">
                <p className="text-sm font-semibold text-green-700">✓ Secure Checkout</p>
                <p className="text-xs text-green-600">Your payment information is safe with us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
