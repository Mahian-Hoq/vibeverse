'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { Plus, Trash2, Loader, AlertCircle, Pencil, X } from 'lucide-react';
import { updateProduct } from '@/app/actions/products';

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
  gallery_images?: string[];
  available_colors?: string[];
  in_stock?: boolean;
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
  const [newProductInStock, setNewProductInStock] = useState(true);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [newProductColors, setNewProductColors] = useState('');

  // Edit form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editSubcategoryId, setEditSubcategoryId] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editGalleryFiles, setEditGalleryFiles] = useState<File[]>([]);
  const [editGalleryPreviews, setEditGalleryPreviews] = useState<string[]>([]);
  const [editColors, setEditColors] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  const handleGalleryImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setSelectedGalleryFiles([]);
      setGalleryPreviews([]);
      return;
    }

    setSelectedGalleryFiles(files);
    const previews = await Promise.all(files.map((file) => fileToDataUrl(file)));
    setGalleryPreviews(previews);
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditGalleryImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setEditGalleryFiles([]);
      setEditGalleryPreviews(editingProduct?.gallery_images || []);
      return;
    }

    setEditGalleryFiles(files);
    const previews = await Promise.all(files.map((file) => fileToDataUrl(file)));
    setEditGalleryPreviews(previews);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditPrice(product.price.toString());
    setEditTags((product.tags || []).join(', '));
    setEditColors((product.available_colors || []).join(', '));
    setEditSubcategoryId(product.subcategory_id);
    setEditInStock(product.in_stock ?? true);
    setEditImageFile(null);
    setEditImagePreview(product.image_url);
    setEditGalleryFiles([]);
    setEditGalleryPreviews(product.gallery_images || []);
    setError(null);
    setSuccessMessage(null);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditGalleryFiles([]);
    setEditGalleryPreviews([]);
    setEditColors('');
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    if (!editTitle.trim()) {
      setError('Product title is required');
      return;
    }

    if (!editDescription.trim()) {
      setError('Product description is required');
      return;
    }

    if (!editPrice || parseFloat(editPrice) <= 0) {
      setError('Valid product price is required');
      return;
    }

    if (!editSubcategoryId) {
      setError('Please select a subcategory');
      return;
    }

    try {
      setIsEditSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      let imageUrl: string | undefined;
      if (editImageFile) {
        imageUrl = await uploadImageToCloudinary(editImageFile);
      }

      let galleryImages: string[] | undefined;
      if (editGalleryFiles.length > 0) {
        galleryImages = await Promise.all(editGalleryFiles.map((file) => uploadImageToCloudinary(file)));
      }

      const tagsArray = editTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const colorsArray = editColors
        .split(',')
        .map((color) => color.trim())
        .filter((color) => color.length > 0);

      const result = await updateProduct({
        id: editingProduct.id,
        title: editTitle.trim(),
        description: editDescription.trim(),
        price: parseFloat(editPrice),
        subcategory_id: editSubcategoryId,
        tags: tagsArray,
        available_colors: colorsArray,
        in_stock: editInStock,
        image_url: imageUrl,
        gallery_images: galleryImages,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setSuccessMessage(`Product "${editTitle}" updated successfully!`);
      closeEditModal();
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setIsEditSubmitting(false);
    }
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
      const galleryImageUrls = selectedGalleryFiles.length > 0
        ? await Promise.all(selectedGalleryFiles.map((file) => uploadImageToCloudinary(file)))
        : [];

      // Parse tags
      const tagsArray = newProductTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const colorsArray = newProductColors
        .split(',')
        .map((color) => color.trim())
        .filter((color) => color.length > 0);

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
          available_colors: colorsArray,
          gallery_images: galleryImageUrls,
          in_stock: newProductInStock,
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage(`Product "${newProductTitle}" added successfully!`);
      // Reset form
      setNewProductTitle('');
      setNewProductDescription('');
      setNewProductPrice('');
      setNewProductTags('');
      setNewProductColors('');
      setNewProductInStock(true);
      setSelectedImageFile(null);
      setImagePreview(null);
      setSelectedGalleryFiles([]);
      setGalleryPreviews([]);
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

          <div>
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors (comma-separated)
            </label>
            <input
              type="text"
              id="colors"
              value={newProductColors}
              onChange={(e) => setNewProductColors(e.target.value)}
              placeholder="e.g., Midnight Black, Rose Gold"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Inventory Status */}
          <div>
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newProductInStock}
                onChange={(e) => setNewProductInStock(e.target.checked)}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
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

          <div>
            <label htmlFor="gallery-images" className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images (optional)
            </label>
            <input
              type="file"
              id="gallery-images"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesSelect}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
            />
            {galleryPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {galleryPreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={preview} alt={`Gallery preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Stock
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(product.image_url);
                        }}
                        className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer border border-gray-200 hover:border-pink-400 transition-colors duration-200"
                        aria-label={`Preview image for ${product.title}`}
                      >
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"%3E%3Crect fill="%23f3f4f6" width="24" height="24"/%3E%3C/svg%3E';
                          }}
                        />
                      </button>
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (product.in_stock ?? true)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {(product.in_stock ?? true) ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          disabled={isEditSubmitting}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
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
                      </div>
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

      {previewImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
            <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="Product preview"
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={closeEditModal}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    disabled={isEditSubmitting}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Tk.)
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    disabled={isEditSubmitting}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  disabled={isEditSubmitting}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    id="edit-subcategory"
                    value={editSubcategoryId}
                    onChange={(e) => setEditSubcategoryId(e.target.value)}
                    disabled={isEditSubmitting || subcategories.length === 0}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200"
                  >
                    {subcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="edit-tags"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    disabled={isEditSubmitting}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-colors" className="block text-sm font-medium text-gray-700 mb-2">
                  Available Colors (comma-separated)
                </label>
                <input
                  type="text"
                  id="edit-colors"
                  value={editColors}
                  onChange={(e) => setEditColors(e.target.value)}
                  disabled={isEditSubmitting}
                  placeholder="e.g., Midnight Black, Rose Gold"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditInStock((prev) => !prev)}
                  aria-pressed={editInStock}
                  disabled={isEditSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    editInStock
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {editInStock ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>

              <div>
                <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Product Image (optional)
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="file"
                      id="edit-image"
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      disabled={isEditSubmitting}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                    />
                  </div>
                  {editImagePreview && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img src={editImagePreview} alt="Edit preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="edit-gallery-images" className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Gallery Images (optional)
                </label>
                <input
                  type="file"
                  id="edit-gallery-images"
                  accept="image/*"
                  multiple
                  onChange={handleEditGalleryImagesSelect}
                  disabled={isEditSubmitting}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-pink-600 focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                />
                {editGalleryPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {editGalleryPreviews.map((preview, idx) => (
                      <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img src={preview} alt={`Edit gallery preview ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isEditSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isEditSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
