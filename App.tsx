import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import DonatePage from './pages/DonatePage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage'; // ✅ Make sure this is correct

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin'); // ✅ This is correct

  return (
    <div className="bg-white text-gray-800 font-body min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      
      <main className="flex-grow">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:id" element={<ProgramDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;