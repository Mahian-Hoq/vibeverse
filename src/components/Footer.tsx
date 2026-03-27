'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Send, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface User {
  email?: string;
}

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Fetch user session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          console.error('Missing Supabase environment variables');
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          setUser({ email: user.email });
          setFeedbackEmail(user.email);
        }
      } catch (error) {
        console.error('Error checking user:', JSON.stringify(error, null, 2));
      }
    };

    checkUser();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trim and validate inputs upfront
    const email = feedbackEmail.trim();
    const message = feedbackMessage.trim();

    if (!email || !message) {
      console.warn('Missing required fields: email or message');
      return;
    }

    try {
      setIsSubmittingFeedback(true);

      // Environment variable checks
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl) {
        console.error('Missing Supabase URL');
        return;
      }

      if (!supabaseAnonKey) {
        console.error('Missing Supabase Anon Key');
        return;
      }

      // Initialize browser-safe Supabase client
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

      // Build payload with exact column names - prevent undefined values
      const payload = {
        user_email: email ?? '', // Fallback to empty string, never undefined
        content: message ?? '', // Fallback to empty string, never undefined
        message_type: 'website_feedback', // Hardcoded, never undefined
        status: 'new', // Hardcoded, never undefined
      };

      console.log('Payload to insert:', JSON.stringify(payload, null, 2));
      console.log('Column names:', Object.keys(payload));

      const { data, error } = await supabase
        .from('feedback')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      } else {
        console.log('✅ Feedback submitted successfully:', data);
        setFeedbackSuccess(true);
        setFeedbackMessage('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setFeedbackSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Supabase Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Logo & Brand Description */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              VibeVerse
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your ultimate destination for trendy women's accessories, makeup, and home decor. Curated for the modern, confident woman.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-pink-400 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-gray-300 hover:text-pink-400 transition-colors duration-200 text-sm text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-pink-400 transition-colors duration-200 text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Feedback Form */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Feedback</h3>
            <p className="text-gray-300 text-sm mb-4">
              We'd love to hear from you. Send us your thoughts!
            </p>
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col space-y-3">
              {/* Success Message */}
              {feedbackSuccess && (
                <div className="bg-green-600 text-white text-sm px-3 py-2 rounded-lg">
                  Thank you! Your feedback has been submitted.
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  readOnly={!!user}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-pink-400 outline-none transition-colors duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Message Textarea */}
              <div className="relative">
                <textarea
                  placeholder="Your feedback message..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-pink-400 outline-none transition-colors duration-200 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback || !feedbackEmail.trim() || !feedbackMessage.trim()}
                className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmittingFeedback ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} VibeVerse. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-300 hover:text-pink-400 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-pink-400 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal - Glassmorphism */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-white/20">
            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>

            <div className="space-y-6">
              {/* Facebook */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Facebook</p>
                  <a
                    href="https://www.facebook.com/profile.php?id=61576072664229"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 break-all"
                  >
                    facebook.com/vibeverse
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.6915026,13.4744748 C17.4788236,13.3599899 16.3420612,12.7826957 16.1272231,12.6982721 C15.9123851,12.6138485 15.7474938,12.5716417 15.5826025,12.7865121 C15.4177112,13.0013825 15.0274926,13.4744748 14.8625983,13.6393091 C14.6977041,13.8041434 14.5328098,13.8463502 14.3179718,13.7318653 C14.1031337,13.6173804 13.4251602,13.4059046 12.6204844,12.6982721 C12.0274926,12.1689983 11.5845582,11.5161792 11.4196639,11.3013088 C11.2547697,11.0864385 11.3856108,10.9292848 11.5005087,10.8148154 C11.6115425,10.7058055 11.7489464,10.5300848 11.8638443,10.3649505 C11.9787422,10.1998162 12.0274926,10.0772098 12.1248902,10.0772098 C12.2222879,10.0772098 12.3009571,10.0350029 12.4119909,9.99279607 C12.5230247,9.95058923 13.405012,9.52651202 13.4036619,9.01326632 C13.4023117,8.67167961 13.2438124,8.59408748 13.143715,8.59408748 L13.1345368,8.59408748 C13.0261152,8.59408748 12.843039,8.62075325 12.6915335,8.78689589 C12.5312267,8.95827309 12.0274926,9.52651202 12.0274926,10.8148154 C12.0274926,12.1031188 12.6564473,13.3388719 12.7713452,13.5037062 C12.8862431,13.6685405 14.3179718,16.0088119 16.5074122,16.9796028 C16.8903296,17.1434385 17.1846504,17.2355826 17.4032118,17.3042903 C17.787128,17.4154508 18.1275156,17.3947517 18.4072635,17.3430074 C18.7268869,17.2820197 19.4000991,16.8973012 19.5398511,16.4714356 C19.6796032,16.04557 19.6796032,15.6908983 19.6308529,15.5719349 C19.5852121,15.4585926 19.4415502,15.4163858 19.2266944,15.3015009" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
                  <a
                    href="https://wa.me/8801759755408"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    +880 1759 755 408
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email</p>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=mrdot1429@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    mrdot1429@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="w-full mt-8 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
