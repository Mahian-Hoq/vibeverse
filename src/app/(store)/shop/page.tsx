import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

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

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}

async function getSubcategoriesByCategory(categoryId: string): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('subcategories')
      .select('id')
      .eq('category_id', categoryId);

    if (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }

    return (data || []).map((subcat) => subcat.id);
  } catch (err) {
    console.error('Failed to fetch subcategories:', err);
    return [];
  }
}

async function getProducts(categoryFilter?: string): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('products').select('*, subcategories(name)').order('created_at', { ascending: false });

    // If category filter exists, we need to filter by subcategories in that category
    if (categoryFilter) {
      const subcategoryIds = await getSubcategoriesByCategory(categoryFilter);

      if (subcategoryIds.length === 0) {
        return [];
      }

      // Fetch products for these subcategories
      const { data, error } = await supabase
        .from('products')
        .select('*, subcategories(name)')
        .in('subcategory_id', subcategoryIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching filtered products:', error);
        return [];
      }

      return data || [];
    }

    // Fetch all products if no category filter
    const { data, error } = await query;

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

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(selectedCategory),
  ]);

  // Find the selected category object for display
  const activeCategoryObj = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-600 mt-2">
            {activeCategoryObj
              ? `Browse ${activeCategoryObj.name}`
              : 'Browse all products'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories Filter */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Categories</h2>

              <nav className="space-y-2">
                {/* All Products Link */}
                <Link
                  href="/shop"
                  className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    !selectedCategory
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </Link>

                {/* Category Links */}
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.id}`}
                    className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-pink-100 text-pink-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>

              {/* Results Count */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {products.length} product{products.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content - Products Grid */}
          <main className="lg:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-lg text-gray-600 mb-2">No products found</p>
                <p className="text-sm text-gray-500 mb-6">
                  {activeCategoryObj
                    ? `We don't have any products in ${activeCategoryObj.name} yet.`
                    : 'Try browsing by category or check back soon!'}
                </p>
                {selectedCategory && (
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    View All Products
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
