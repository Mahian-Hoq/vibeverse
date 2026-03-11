import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  subcategory_id: string;
  subcategories?: {
    name: string;
  };
}

async function getLatestProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, subcategories(name)')
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
}

export default async function Home() {
  const products = await getLatestProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-300 to-blue-300 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Elevate Your Vibe.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Discover trendy women's accessories, makeup, and home decor curated for the modern, confident you. Express yourself like never before.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                href="#new-arrivals"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Shop Now
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold rounded-lg transition-all duration-200"
              >
                Explore Collections
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Fresh pieces just dropped. Discover what's trending this season.
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {/* Product Image & Link */}
                  <Link href={`/product/${product.id}`} className="relative overflow-hidden bg-gray-100 aspect-square block">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow p-4 sm:p-5">
                    {/* Subcategory */}
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">
                      {product.subcategories?.name || 'Accessories'}
                    </p>

                    {/* Title */}
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-200 cursor-pointer">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Price */}
                    <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 mt-auto">
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Add to Cart Button */}
                    <AddToCartButton
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image_url: product.image_url,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-lg p-12">
                <p className="text-lg text-gray-600 mb-4">No products available yet.</p>
                <p className="text-sm text-gray-500">Check back soon for exciting new arrivals!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-pink-50 to-purple-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Trust Item 1 */}
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">100%</div>
              <p className="text-gray-700 font-semibold">Authentic</p>
              <p className="text-sm text-gray-600">All products guaranteed authentic</p>
            </div>

            {/* Trust Item 2 */}
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Free</div>
              <p className="text-gray-700 font-semibold">Fast Shipping</p>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>

            {/* Trust Item 3 */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">30 Days</div>
              <p className="text-gray-700 font-semibold">Easy Returns</p>
              <p className="text-sm text-gray-600">Hassle-free return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
