'use client';

import { useEffect, useState } from 'react';

interface HeroBanner {
  id: string;
  image_url: string;
}

export default function HeroSliderClient({ initialBanners }: { initialBanners: HeroBanner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % initialBanners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [initialBanners.length]);

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Slider Container */}
      <div className="absolute inset-0">
        {initialBanners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${banner.image_url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentIndex ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-20"></div>

      {/* Hero Content */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
              Elevate Your Vibe.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto">
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
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Explore Collections
            </a>
          </div>
        </div>
      </div>

      {/* Indicator Dots */}
      {initialBanners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
          {initialBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? 'bg-white w-8 h-3'
                  : 'bg-white/50 hover:bg-white/75 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
