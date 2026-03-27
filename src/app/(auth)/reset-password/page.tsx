import { Suspense } from 'react';
import ResetPasswordContent from '../ResetPasswordContent';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <Suspense fallback={<div className="flex items-center justify-center"><div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
