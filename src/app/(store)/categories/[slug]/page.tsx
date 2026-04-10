import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Package } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  in_stock?: boolean;
  subcategory_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params in Next.js 16.x
  const { slug } = await params;
  const supabase = await createClient();

  console.log('CategoryPage - Slug:', slug);

  // Fetch category info
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (categoryError) {
    console.error('Category fetch error:', categoryError);
  }

  if (!categoryData) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-2">Slug: {slug}</p>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link href="/shop" className="text-pink-600 hover:text-pink-700 font-semibold">
            ← Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  // Fetch all subcategories for this category
  const { data: subcategoriesData, error: subcatError } = await supabase
    .from('subcategories')
    .select('id')
    .eq('category_id', categoryData.id);

  if (subcatError) {
    console.error('Subcategories fetch error:', subcatError);
  }

  const subcategoryIds = (subcategoriesData || []).map((sc) => sc.id);

  // Fetch products for these subcategories
  let products = [];
  if (subcategoryIds.length > 0) {
    const { data: productsData, error } = await supabase
      .from('products')
      .select('*')
      .in('subcategory_id', subcategoryIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      products = productsData || [];
    }
  }

  const categoryProducts = (products || []) as Product[];
  const isComboOffersCategory = slug === 'combo-offers';

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{categoryData.name}</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            {isComboOffersCategory
              ? 'Discover our premium combo packages - perfectly curated bundles to enhance your experience. Get more, save more!'
              : `Explore our curated collection of ${categoryData.name.toLowerCase()} products.`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categoryProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Products Available</h2>
            <p className="text-gray-500 mb-8">Check back soon for new products in this category!</p>
            <Link href="/shop" className="secondary-btn">
              Browse All Products
            </Link>
          </div>
        ) : isComboOffersCategory ? (
          // PREMIUM HORIZONTAL CARDS FOR COMBO OFFERS
          <div className="space-y-6">
            {categoryProducts.map((product) => (
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
                        alt={product.title}
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
                    {/* Stock Badge */}
                    {!(product.in_stock ?? true) && (
                      <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {(product.in_stock ?? true) && (
                      <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        In Stock
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Features Section */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                          What's Included
                        </h4>
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
                        className={`inline-flex items-center gap-3 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform shadow-lg ${
                          product.in_stock ?? true
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 hover:scale-105'
                            : 'bg-gray-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {product.in_stock ?? true ? 'View Details' : 'Out of Stock'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // STANDARD GRID CARDS FOR OTHER CATEGORIES
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                    {/* Stock Badge */}
                    {!(product.in_stock ?? true) && (
                      <div className="absolute top-2 right-2 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {(product.in_stock ?? true) && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        In Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-2xl font-bold text-pink-600 mb-4">
                        ৳{product.price.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg font-semibold py-2 sm:py-3 rounded-lg transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
