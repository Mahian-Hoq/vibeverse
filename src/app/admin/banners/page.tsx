'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Upload, Trash2, Loader, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

interface HeroBanner {
  id: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch banners on mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('hero_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setBanners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedImageFile(file);
      setError(null);

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

  const handleUploadBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImageFile) {
      setError('Please select a banner image');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // Upload image to Cloudinary first
      const imageUrl = await uploadImageToCloudinary(selectedImageFile);

      const supabase = createClient();

      // Insert banner into Supabase
      const { error: insertError } = await supabase.from('hero_banners').insert([
        {
          image_url: imageUrl,
          is_active: true,
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage('Banner uploaded successfully!');
      // Reset form
      setSelectedImageFile(null);
      setImagePreview(null);
      await fetchBanners();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload banner');
      console.error('Error uploading banner:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError(null);

      const supabase = createClient();

      const { error: deleteError } = await supabase.from('hero_banners').delete().eq('id', id);

      if (deleteError) throw deleteError;

      setSuccessMessage('Banner deleted successfully!');
      await fetchBanners();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete banner');
      console.error('Error deleting banner:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setToggleLoading(id);
      setError(null);

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('hero_banners')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      const status = !currentStatus ? 'activated' : 'deactivated';
      setSuccessMessage(`Banner ${status} successfully!`);
      await fetchBanners();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update banner');
      console.error('Error updating banner:', err);
    } finally {
      setToggleLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-pink-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hero Banners</h1>
        <p className="text-gray-600 mt-2">Manage the hero slider images that display on the landing page.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Banner</h2>

        <form onSubmit={handleUploadBanner} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label htmlFor="banner-image" className="block text-sm font-medium text-gray-700 mb-3">
              Banner Image (1920x600px recommended)
            </label>

            {/* Preview */}
            {imagePreview && (
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* File Input */}
            <label className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 cursor-pointer transition-colors">
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-medium">
                  {selectedImageFile ? selectedImageFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                id="banner-image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !selectedImageFile}
            className="w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Banner
              </>
            )}
          </button>
        </form>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Active Banners ({banners.length})</h2>
        </div>

        {banners.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No banners yet. Upload your first banner above!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {banners.map((banner) => (
              <div key={banner.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Banner Preview */}
                  <div className="lg:col-span-2">
                    <img
                      src={banner.image_url}
                      alt="Banner"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Banner Info */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(banner.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      {banner.is_active ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <Eye className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          <EyeOff className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(banner.id, banner.is_active)}
                      disabled={toggleLoading === banner.id}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      title={banner.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {toggleLoading === banner.id ? (
                        <Loader className="w-4 h-4 animate-spin mx-auto" />
                      ) : banner.is_active ? (
                        <EyeOff className="w-4 h-4 mx-auto" />
                      ) : (
                        <Eye className="w-4 h-4 mx-auto" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      disabled={deleteLoading === banner.id}
                      className="flex-1 px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {deleteLoading === banner.id ? (
                        <Loader className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        <Trash2 className="w-4 h-4 mx-auto" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
