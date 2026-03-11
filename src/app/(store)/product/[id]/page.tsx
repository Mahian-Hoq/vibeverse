import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  subcategory_id: string;
  tags: string[];
  subcategories?: {
    name: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, subcategories(name)')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as Product;
  } catch (err) {
    console.error('Failed to fetch product:', err);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* Left Column - Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col justify-start space-y-6">
            {/* Subcategory */}
            <div>
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">
                {product.subcategories?.name || 'Accessories'}
              </p>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div>
              <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-200 py-6">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-4 pt-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image_url: product.image_url,
                }}
                className="flex-1 py-4 sm:py-5 text-lg"
              />
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Product ID</span>
                <span className="text-gray-900 font-mono text-sm">{product.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Category</span>
                <span className="text-gray-900">{product.subcategories?.name || 'Accessories'}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="font-bold text-blue-600">100%</p>
                <p className="text-sm text-gray-600">Authentic</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="font-bold text-green-600">Free</p>
                <p className="text-sm text-gray-600">Fast Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section (Placeholder for future) */}
      <div className="bg-gray-50 py-16 sm:py-20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            More Styles Coming Soon
          </h2>
          <p className="text-gray-600 mb-8">
            Check back for related products and recommendations
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
