'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, LogIn, LogOut, Settings, Sparkles } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { createClient } from '@/utils/supabase/client';
import CartWidget from './CartWidget';

interface User {
  id: string;
  email?: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area - Brand name with icon */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {/* Brand Name */}
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                VibeVerse
              </h1>
            </div>

            {/* Desktop Menu - Hidden on tablet/mobile, shown at lg breakpoint */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link
                href="/shop"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                Shop All
              </Link>
              <a
                href="#"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                Collections
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                About
              </a>
            </div>

            {/* Search Bar - Hidden on mobile/tablet, shown at lg breakpoint */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-pink-600 outline-none transition-colors duration-200"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

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
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="hidden lg:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </form>
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
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-pink-600 outline-none transition-colors duration-200"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Mobile Navigation Links */}
            <Link
              href="/shop"
              className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop All
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors duration-200"
            >
              Collections
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors duration-200"
            >
              About
            </a>

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
                  <form action={signOut} className="w-full">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </form>
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
