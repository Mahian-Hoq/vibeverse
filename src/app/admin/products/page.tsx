'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Loader, AlertCircle } from 'lucide-react';

interface Subcategory {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  subcategory_id: string;
  tags: string[];
  created_at: string;
  subcategories?: {
    name: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductTags, setNewProductTags] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('id, name')
        .order('name', { ascending: true });

      if (subcategoriesError) throw subcategoriesError;

      // Fetch products with related subcategory data
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, subcategories(name)')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setSubcategories(subcategoriesData || []);
      setProducts(productsData || []);

      // Set default subcategory to first one if available
      if ((subcategoriesData || []).length > 0 && !selectedSubcategoryId) {
        setSelectedSubcategoryId(subcategoriesData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProductTitle.trim()) {
      setError('Product title is required');
      return;
    }

    if (!newProductDescription.trim()) {
      setError('Product description is required');
      return;
    }

    if (!newProductPrice || parseFloat(newProductPrice) <= 0) {
      setError('Valid product price is required');
      return;
    }

    if (!selectedSubcategoryId) {
      setError('Please select a subcategory');
      return;
    }

    if (!selectedImageFile) {
      setError('Please select a product image');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // Upload image to Cloudinary first
      const imageUrl = await uploadImageToCloudinary(selectedImageFile);

      // Parse tags
      const tagsArray = newProductTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const supabase = createClient();

      // Insert product into Supabase
      const { error: insertError } = await supabase.from('products').insert([
        {
          title: newProductTitle.trim(),
          description: newProductDescription.trim(),
          price: parseFloat(newProductPrice),
          image_url: imageUrl,
          subcategory_id: selectedSubcategoryId,
          tags: tagsArray,
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage(`Product "${newProductTitle}" added successfully!`);
      // Reset form
      setNewProductTitle('');
      setNewProductDescription('');
      setNewProductPrice('');
      setNewProductTags('');
      setSelectedImageFile(null);
      setImagePreview(null);
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      console.error('Error adding product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError(null);

      const supabase = createClient();

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccessMessage(`Product "${title}" deleted successfully!`);
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      console.error('Error deleting product:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getSubcategoryName = (subcategoryId: string): string => {
    return subcategories.find((subcat) => subcat.id === subcategoryId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600 mt-2">Manage your product catalog here.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="font-medium text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Add Product Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-6">
          {/* Title and Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                id="title"
                value={newProductTitle}
                onChange={(e) => setNewProductTitle(e.target.value)}
                placeholder="e.g., Gold Necklace"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                placeholder="e.g., 29.99"
                step="0.01"
                min="0"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
              placeholder="Describe your product..."
              rows={4}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Subcategory and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                id="subcategory"
                value={selectedSubcategoryId}
                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                disabled={isSubmitting || subcategories.length === 0}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {subcategories.length === 0 ? 'No subcategories available' : 'Select a subcategory'}
                </option>
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.id}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={newProductTags}
                onChange={(e) => setNewProductTags(e.target.value)}
                placeholder="e.g., jewelry, gold, elegant"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                />
              </div>
              {imagePreview && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newProductTitle.trim() || !newProductDescription.trim() || !newProductPrice || !selectedSubcategoryId || !selectedImageFile || subcategories.length === 0}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Products</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="w-8 h-8 text-pink-600 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No products yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Subcategory
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"%3E%3Crect fill="%23f3f4f6" width="24" height="24"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-pink-600">
                      Tk. {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {product.subcategories?.name || getSubcategoryName(product.subcategory_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {product.tags && product.tags.length > 0 ? (
                          product.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">No tags</span>
                        )}
                        {product.tags && product.tags.length > 2 && (
                          <span className="text-gray-500 text-xs">+{product.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.title)}
                        disabled={deleteLoading === product.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteLoading === product.id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
            Showing {products.length} product{products.length === 1 ? '' : 's'}
          </div>
        )}
      </div>
    </div>
  );
}
