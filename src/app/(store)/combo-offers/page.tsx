import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default async function ComboOffersPage() {
  const supabase = await createClient();

  // Fetch all products with category 'Combos'
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'Combos')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching combo products:', error);
  }

  const comboProducts = (products || []) as Product[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Combo Offers</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Discover our premium combo packages - perfectly curated bundles to enhance your experience. Get more, save more!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {comboProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Combos Available</h2>
            <p className="text-gray-500 mb-8">Check back soon for our amazing combo packages!</p>
            <Link
              href="/shop"
              className="secondary-btn"
            >
              Explore All Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {comboProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className="md:w-1/3 relative h-64 md:h-80 overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-16 h-16" />
                      </div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                      Combo Deal
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Features Section */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">What's Included</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            <span className="text-sm">Premium Quality</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            <span className="text-sm">Fast Delivery</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            <span className="text-sm">Best Value</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            <span className="text-sm">Secure Payment</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Special Combo Price</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          ৳{product.price.toLocaleString()}
                        </p>
                      </div>
                      <Link
                        href={`/product/${product.id}`}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
