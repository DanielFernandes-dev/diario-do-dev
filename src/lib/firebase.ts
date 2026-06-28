import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCYFmlxioPVk6INMPDFRmB6E_snXoVkNtI',
  authDomain: 'diario-do-dev.firebaseapp.com',
  projectId: 'diario-do-dev',
  storageBucket: 'diario-do-dev.firebasestorage.app',
  messagingSenderId: '471058793756',
  appId: '1:471058793756:web:d88e62cd7e26948f2b66d9',
  measurementId: 'G-067LPWVSBH',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const ADMIN_EMAILS = ['danielfernandesdeoliveira459@gmail.com'];

// Analytics só é inicializado quando o ambiente do navegador suporta isso.
export const analyticsPromise: Promise<Analytics | null> = isSupported().then((supported) => {
  if (!supported) return null;
  return getAnalytics(app);
});
