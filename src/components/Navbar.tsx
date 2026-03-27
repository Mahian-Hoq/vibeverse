'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Search, LogIn, LogOut, Settings } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { createClient } from '@/utils/supabase/client';
import CartWidget from './CartWidget';

interface User {
  id: string;
  email?: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        setUser(user as User | null);
        
        // Check if user is admin
        if (user?.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL === user.email) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      // Refresh the page to revalidate session and update navbar
      router.refresh();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: try to sign out with Supabase client directly
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area - Brand name with icon */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              {/* Logo Icon */}
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Image src="/icon.png" alt="VibeVerse Icon" width={32} height={32} className="object-contain" />
              </div>
              {/* Brand Name */}
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                VibeVerse
              </h1>
            </Link>

            {/* Desktop Menu - Hidden on tablet/mobile, shown at lg breakpoint */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link
                href="/shop"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                Shop All
              </Link>
              <Link
                href="/categories/combo-offers"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                Combo Offers
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                About
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile/tablet, shown at lg breakpoint */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-pink-600 focus:outline-none transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors duration-200"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Admin Panel Link - Only for admin users */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden lg:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}

              {/* Login/Logout Button - Hidden on tablet/mobile, shown at lg breakpoint */}
              {!isLoading && (
                <>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="hidden lg:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="w-5 h-5" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden lg:flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      <LogIn className="w-5 h-5" />
                      Login
                    </Link>
                  )}
                </>
              )}

              {/* Cart Widget */}
              <CartWidget />

              {/* Hamburger Menu - Hidden at lg and above */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-gray-700 hover:text-pink-600 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Sidebar */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 w-full bg-white shadow-lg z-40 border-b-2 border-gray-100">
          <div className="flex flex-col space-y-4 p-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-pink-600 outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <Link
              href="/shop"
              className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link
              href="/categories/combo-offers"
              className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Combo Offers
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {/* Admin Panel Link - Mobile */}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-purple-600 hover:text-purple-700 font-medium py-2 transition-colors duration-200 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            {/* Mobile Login/Logout Button */}
            {!isLoading && (
              <>
                {user ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 mt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
