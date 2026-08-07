import { AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AuthErrorBanner() {
  const { authError, clearAuthError } = useAuth();

  if (!authError) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex items-center gap-3 border-b border-red-500/30 bg-red-950/90 px-4 py-3 backdrop-blur-sm">
      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
      <p className="flex-1 text-sm text-red-200">{authError}</p>
      <button onClick={clearAuthError} className="text-red-400 hover:text-red-200">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
