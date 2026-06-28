import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

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

// Analytics só é inicializado quando o ambiente do navegador suporta isso.
export const analyticsPromise: Promise<Analytics | null> = isSupported().then((supported) => {
  if (!supported) return null;
  return getAnalytics(app);
});
