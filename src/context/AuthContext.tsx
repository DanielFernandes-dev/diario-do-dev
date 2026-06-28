import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type User,
} from 'firebase/auth';
import { ADMIN_EMAILS, auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se há resultado de um redirect pendente
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('[Auth] Redirect login bem-sucedido:', result.user.email);
        }
      })
      .catch((err) => {
        console.error('[Auth] Erro no redirect result:', err);
        setAuthError(friendlyError(err.code));
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[Auth] Estado mudou:', user?.email ?? 'null');
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin =
    !!currentUser?.email &&
    ADMIN_EMAILS.includes(currentUser.email.toLowerCase());

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('[Auth] Login via popup bem-sucedido:', result.user.email);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      console.error('[Auth] Erro no popup:', code, err);

      // Popup foi bloqueado ou fechado — tenta redirect como fallback
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        console.log('[Auth] Popup falhou, tentando redirect...');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr) {
          console.error('[Auth] Erro no redirect:', redirectErr);
          setAuthError('Não foi possível abrir o login. Verifique se popups estão permitidos.');
        }
        return;
      }

      // Erros de domínio/configuração
      if (code === 'auth/unauthorized-domain') {
        setAuthError(
          'Domínio não autorizado no Firebase. Adicione este domínio nas configurações do Firebase Auth.',
        );
        return;
      }

      setAuthError(friendlyError(code));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('[Auth] Erro no logout:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{ currentUser, isAdmin, isLoading, authError, handleGoogleLogin, handleLogout, clearAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function friendlyError(code: string): string {
  const messages: Record<string, string> = {
    'auth/network-request-failed': 'Erro de rede. Verifique sua conexão.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
    'auth/user-disabled': 'Conta desativada.',
    'auth/operation-not-allowed': 'Login com Google não está habilitado no Firebase.',
    'auth/internal-error': 'Erro interno do Firebase. Tente novamente.',
  };
  return messages[code] ?? `Erro ao fazer login (${code || 'desconhecido'}). Tente novamente.`;
}
