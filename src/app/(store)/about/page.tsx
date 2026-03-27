'use client';

import Link from 'next/link';
import { Heart, Zap, Shield, TrendingUp, Users, Award, Truck, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-600 via-purple-600 to-pink-500 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Welcome to VibeVerse
          </h1>
          <p className="text-xl sm:text-2xl text-pink-100 font-light">
            Where Quality Meets Trust, and Style Meets Substance
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                VibeVerse was founded with a simple yet powerful vision: to bring premium, carefully curated products directly to your doorstep. We believe that everyone deserves access to high-quality items without compromising on quality, affordability, or convenience.
              </p>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                What started as a passion project has grown into a trusted platform serving thousands of happy customers across Bangladesh. Every day, we wake up with one mission: to exceed your expectations and become your go-to destination for all your lifestyle needs.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our team works tirelessly to source the finest products, negotiate the best prices, and ensure every customer experience is nothing short of exceptional. Because for us, you're not just a customer—you're part of the VibeVerse family.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-12 border border-pink-200">
                <div className="text-center">
                  <Heart className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Made with Passion</h3>
                  <p className="text-gray-700">
                    Every product, every interaction, every promise we make is driven by genuine care for our customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Promise Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Our Quality Promise</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We stand behind every single product we offer. Your satisfaction is our guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quality Card 1 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Authentic Products</h3>
              <p className="text-gray-700">
                Every item is handpicked and verified for authenticity. No counterfeits, no compromises—just genuine quality.
              </p>
            </div>

            {/* Quality Card 2 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Reliable Delivery</h3>
              <p className="text-gray-700">
                We've partnered with the best logistics providers to ensure your orders arrive safely and on time, every time.
              </p>
            </div>

            {/* Quality Card 3 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-700">
                Your financial security is our priority. Enjoy bKash, COD, and other secure payment methods with complete peace of mind.
              </p>
            </div>

            {/* Quality Card 4 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Buyer Protection</h3>
              <p className="text-gray-700">
                Full protection on every purchase. Unsatisfied? Easy returns, quick refunds, and round-the-clock customer support.
              </p>
            </div>

            {/* Quality Card 5 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Best Value</h3>
              <p className="text-gray-700">
                Competitive pricing without compromising quality. We work directly with suppliers to bring you the best deals.
              </p>
            </div>

            {/* Quality Card 6 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Community</h3>
              <p className="text-gray-700">
                Join thousands of satisfied customers who have made VibeVerse their trusted shopping destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-center">Why Choose VibeVerse?</h2>
          <p className="text-xl text-gray-700 text-center mb-16 max-w-3xl mx-auto">
            We're not just another e-commerce platform. We're your partner in finding the perfect products at unbeatable prices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Reason 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100">
                  <Zap className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure bKash & COD Payments</h3>
                <p className="text-gray-700">
                  Shop with confidence using Bangladesh's most popular payment methods. Multiple secure payment options designed for your convenience and security. Your payment data is always protected with industry-leading encryption.
                </p>
              </div>
            </div>

            {/* Reason 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100">
                  <Truck className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning-Fast Delivery</h3>
                <p className="text-gray-700">
                  Fast, reliable delivery across Bangladesh. Track your order in real-time and receive your products at lightning speed. Same-day delivery available in Dhaka and major cities. Your time is valuable—we respect it.
                </p>
              </div>
            </div>

            {/* Reason 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100">
                  <Award className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Curated Selection</h3>
                <p className="text-gray-700">
                  Every product in our catalog has been carefully selected by our expert team. We partner with only the best suppliers and brands to ensure you always get premium quality at the best possible price.
                </p>
              </div>
            </div>

            {/* Reason 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer-First Service</h3>
                <p className="text-gray-700">
                  Your satisfaction is our mission. Our dedicated support team is always ready to help you 24/7. Hassle-free returns, instant refunds, and genuine care for every customer. You're not just a transaction to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Experience VibeVerse?</h2>
          <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">
            Join thousands of happy customers who trust us for quality products, fast delivery, and exceptional service.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-pink-600 font-bold py-4 px-10 rounded-xl hover:bg-pink-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>

      {/* Footer Trust Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-pink-600 mb-2">5k+</p>
              <p className="text-gray-700">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-600 mb-2">10k+</p>
              <p className="text-gray-700">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-600 mb-2">100%</p>
              <p className="text-gray-700">Secure Payment</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-600 mb-2">24/7</p>
              <p className="text-gray-700">Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
