import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthErrorBanner } from './components/common/AuthErrorBanner';
import { Home } from './pages/Home';
import { PostPage } from './pages/PostPage';

function App() {
  return (
    <AuthProvider>
      <AuthErrorBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
