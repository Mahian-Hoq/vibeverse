import { Suspense } from 'react';
import CheckoutSuccessContent from './CheckoutSuccessContent';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <Suspense fallback={<div className="flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
