import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  in_stock?: boolean;
  tags: string[];
  subcategory_id: string;
  subcategories?: {
    name: string;
  };
}

async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const supabase = await createClient();

    // Search across title, description, and tags
    // We fetch all products and filter client-side to handle array search
    const { data, error } = await supabase
      .from('products')
      .select('*, subcategories(name)')
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%`
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    // Filter by tags as well (since we can't do array contains with ilike)
    const searchTermLower = query.toLowerCase();
    const filtered = (data || []).filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(searchTermLower);
      const descriptionMatch = product.description.toLowerCase().includes(searchTermLower);
      const tagsMatch = product.tags?.some((tag: string) => tag.toLowerCase().includes(searchTermLower)) ?? false;
      
      return titleMatch || descriptionMatch || tagsMatch;
    });

    return filtered;
  } catch (err) {
    console.error('Failed to search products:', err);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q || '';
  const products = await searchProducts(searchQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-600 mt-2">
            {searchQuery ? (
              <>
                Results for "<span className="font-semibold text-gray-900">{searchQuery}</span>"
              </>
            ) : (
              'Enter a search term to find products'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchQuery ? (
          <>
            {products.length > 0 ? (
              <>
                {/* Results Grid */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Found {products.length} product{products.length === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

                        {/* Tags - if present and relevant to search */}
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                            {product.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="inline-block bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 mt-auto">
                          Tk. {product.price.toFixed(2)}
                        </p>
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
              </>
            ) : (
              /* No Results State */
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching "<span className="font-semibold">{searchQuery}</span>". Try:
                </p>
                <ul className="text-sm text-gray-600 mb-8 space-y-1 inline-block text-left">
                  <li>• Checking your spelling</li>
                  <li>• Trying different keywords</li>
                  <li>• Using more general terms</li>
                </ul>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Browse Shop
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                  >
                    Back Home
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No search term entered</h2>
            <p className="text-gray-600 mb-6">Use the search bar to find products by name, description, or tags.</p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Browse Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
