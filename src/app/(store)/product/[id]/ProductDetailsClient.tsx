'use client';

import { useMemo, useState } from 'react';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductDetailsClientProps {
  product: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    gallery_images?: string[];
    available_colors?: string[];
    in_stock?: boolean;
  };
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const images = useMemo(() => {
    const merged = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);
    return Array.from(new Set(merged));
  }, [product.image_url, product.gallery_images]);

  const colors = (product.available_colors || []).filter((color) => color.trim().length > 0);
  const hasColors = colors.length > 0;
  const [selectedImage, setSelectedImage] = useState(images[0] || product.image_url);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const isInStock = product.in_stock ?? true;
  const requiresColorSelection = hasColors && !selectedColor;

  const handlePreviousImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[nextIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(images[nextIndex]);
  };

  return (
    <>
      <div className="w-full bg-gray-100 rounded-xl overflow-hidden shadow-lg relative flex items-center justify-center min-h-[400px]">
        <img
          src={selectedImage}
          alt={product.title}
          className="w-auto max-h-[60vh] object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePreviousImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md font-bold"
              aria-label="View previous image"
            >
              {'<'}
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md font-bold"
              aria-label="View next image"
            >
              {'>'}
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              type="button"
              key={`${img}-${idx}`}
              onClick={() => setSelectedImage(img)}
              className={`h-20 flex items-center justify-center rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === img ? 'border-pink-500' : 'border-gray-200 hover:border-pink-300'
              }`}
              aria-label={`Select image ${idx + 1}`}
            >
              <img src={img} alt={`${product.title} thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {hasColors && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  selectedColor === color
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-pink-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          {requiresColorSelection && (
            <p className="mt-2 text-sm text-amber-700">Please select a color before adding to cart.</p>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <AddToCartButton
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            image_url: product.image_url,
            selectedColor: selectedColor || undefined,
          }}
          disabled={!isInStock || requiresColorSelection}
          disabledLabel={!isInStock ? 'Out of Stock' : 'Select Color'}
          className="flex-1 py-4 sm:py-5 text-lg"
        />
      </div>
    </>
  );
}
