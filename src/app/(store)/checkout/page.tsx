'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const SHIPPING_COST = 5.0;

interface OrderFormData {
  name: string;
  whatsapp_number: string;
  delivery_address: string;
  payment_method: 'COD' | 'BKASH';
  bkash_last_3: string;
}

interface SubmitStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isHydrated, setIsHydrated] = useState(false);

  // Form state
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    whatsapp_number: '',
    delivery_address: '',
    payment_method: 'COD',
    bkash_last_3: '',
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: 'idle' });

  // Hydrate and validate cart
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/shop');
    }
  }, [isHydrated, items, router]);

  if (!isHydrated || items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = SHIPPING_COST;
  const total = subtotal + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method: 'COD' | 'BKASH') => {
    setFormData((prev) => ({
      ...prev,
      payment_method: method,
      bkash_last_3: '', // Clear bKash field when switching
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your name' });
      return false;
    }
    if (!formData.whatsapp_number.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your WhatsApp number' });
      return false;
    }
    if (!formData.delivery_address.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your delivery address' });
      return false;
    }
    if (formData.payment_method === 'BKASH' && !formData.bkash_last_3.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter the last 3 digits of your bKash number' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading' });

    if (!validateForm()) {
      return;
    }

    try {
      // 1. Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: null, // Guest checkout
            total_amount: total,
            payment_method: formData.payment_method,
            whatsapp_number: formData.whatsapp_number,
            bkash_last_3: formData.payment_method === 'BKASH' ? formData.bkash_last_3 : null,
            delivery_address: formData.delivery_address,
            customer_name: formData.name,
            status: 'Pending',
          },
        ])
        .select();

      if (orderError || !orderData || orderData.length === 0) {
        throw new Error(orderError?.message || 'Failed to create order');
      }

      const orderId = orderData[0].id;

      // 2. Insert order items
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) {
        throw new Error(itemsError.message || 'Failed to add items to order');
      }

      // 3. Clear cart and redirect
      clearCart();
      setSubmitStatus({ type: 'success', message: 'Order placed successfully!' });

      // Redirect to success page after 1 second
      setTimeout(() => {
        router.push(`/checkout/success?order_id=${orderId}`);
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while placing your order';
      setSubmitStatus({ type: 'error', message: errorMessage });
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">Checkout</h1>

        {/* Alert Messages */}
        {submitStatus.type === 'error' && (
          <div className="mb-8 p-4 sm:p-6 bg-red-50 border-l-4 border-red-600 rounded-lg flex gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-800">{submitStatus.message}</p>
            </div>
          </div>
        )}

        {submitStatus.type === 'success' && (
          <div className="mb-8 p-4 sm:p-6 bg-green-50 border-l-4 border-green-600 rounded-lg flex gap-4">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Success!</h3>
              <p className="text-green-800">{submitStatus.message}</p>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
                </div>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                {/* WhatsApp Number Field */}
                <div>
                  <label htmlFor="whatsapp_number" className="block text-sm font-semibold text-gray-900 mb-2">
                    WhatsApp Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="whatsapp_number"
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleInputChange}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Delivery Address Field */}
                <div>
                  <label htmlFor="delivery_address" className="block text-sm font-semibold text-gray-900 mb-2">
                    Delivery Address <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="delivery_address"
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address here..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>

                {/* COD Option */}
                <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-pink-600 transition-colors duration-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={formData.payment_method === 'COD'}
                      onChange={() => handlePaymentMethodChange('COD')}
                      className="w-4 h-4 text-pink-600 border-gray-300 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-900 font-semibold">Cash on Delivery (COD)</span>
                  </label>
                  <p className="ml-7 mt-2 text-sm text-gray-600">Pay in cash when your order arrives</p>
                </div>

                {/* bKash Option */}
                <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-pink-600 transition-colors duration-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="BKASH"
                      checked={formData.payment_method === 'BKASH'}
                      onChange={() => handlePaymentMethodChange('BKASH')}
                      className="w-4 h-4 text-pink-600 border-gray-300 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-900 font-semibold">bKash</span>
                  </label>
                  <p className="ml-7 mt-2 text-sm text-gray-600">Send money to our bKash account</p>
                </div>

                {/* bKash Details (Conditional) */}
                {formData.payment_method === 'BKASH' && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">bKash Payment Instructions:</h3>
                      <p className="text-blue-800 text-sm">
                        Please send <span className="font-bold">${total.toFixed(2)}</span> to our bKash account:
                      </p>
                      <p className="text-blue-900 font-mono font-bold text-lg mt-2">017XXXXXXXX</p>
                      <p className="text-blue-800 text-sm mt-2">
                        After sending the money, please enter the last 3 digits of your bKash number below.
                      </p>
                    </div>

                    {/* bKash Last 3 Digits */}
                    <div>
                      <label htmlFor="bkash_last_3" className="block text-sm font-semibold text-blue-900 mb-2">
                        Last 3 Digits of Your bKash Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="bkash_last_3"
                        name="bkash_last_3"
                        value={formData.bkash_last_3}
                        onChange={handleInputChange}
                        placeholder="e.g., 123"
                        maxLength={3}
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitStatus.type === 'loading'}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center gap-2"
              >
                {submitStatus.type === 'loading' && <Loader className="w-5 h-5 animate-spin" />}
                {submitStatus.type === 'loading' ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-24 p-6 space-y-6">
              {/* Summary Title */}
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-4 border-t border-b border-gray-200 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.title}</p>
                      <p className="text-gray-600 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 ml-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-green-50 rounded-lg p-4 text-center space-y-2">
                <p className="text-sm font-semibold text-green-700">✓ Secure Checkout</p>
                <p className="text-xs text-green-600">Your information is safe with us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
