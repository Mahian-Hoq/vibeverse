import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import HeroSlider from '@/components/HeroSlider';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  in_stock?: boolean;
  subcategory_id: string;
  subcategories?: {
    name: string;
  };
}

async function getLatestProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
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
      {/* Hero Slider Section */}
      <HeroSlider />

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
                      Tk. {product.price.toFixed(2)}
                    </p>

                    {/* Add to Cart Button */}
                    <AddToCartButton
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image_url: product.image_url,
                      }}
                      disabled={!(product.in_stock ?? true)}
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
              <div className="text-3xl font-bold text-purple-600 mb-2">Fast</div>
              <p className="text-gray-700 font-semibold">Delivery</p>
              <p className="text-sm text-gray-600">On any region of Bangladesh</p>
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
