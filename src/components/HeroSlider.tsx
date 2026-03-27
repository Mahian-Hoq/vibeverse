import { createClient } from '@/utils/supabase/server';
import HeroSliderClient from './HeroSliderClient';

interface HeroBanner {
  id: string;
  image_url: string;
  is_active: boolean;
}

async function getActiveBanners(): Promise<HeroBanner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('hero_banners')
      .select('id, image_url, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hero banners:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch hero banners:', err);
    return [];
  }
}

export default async function HeroSlider() {
  const banners = await getActiveBanners();
  const hasBanners = banners.length > 0;

  if (!hasBanners) {
    // Fallback to gradient background
    return (
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
    );
  }

  // Dynamic banner slider
  return <HeroSliderClient initialBanners={banners} />;
}
