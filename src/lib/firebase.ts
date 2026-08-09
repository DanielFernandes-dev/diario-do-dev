import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

const adminEmailsEnv = import.meta.env.VITE_ADMIN_EMAILS;
export const ADMIN_EMAILS = adminEmailsEnv
  ? adminEmailsEnv.split(',').map((email: string) => email.trim())
  : [];

// Analytics só é inicializado quando o ambiente do navegador suporta isso.
export const analyticsPromise: Promise<Analytics | null> = isSupported().then((supported) => {
  if (!supported) return null;
  return getAnalytics(app);
});
