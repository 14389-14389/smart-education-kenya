import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; // Might need .jsx extension
import AboutPage from './pages/AboutPage'; // Might need .jsx extension
import ProgramsPage from './pages/ProgramsPage'; // Might need .jsx extension
import ProgramDetailPage from './pages/ProgramDetailPage'; // Might need .jsx extension
import GalleryPage from './pages/GalleryPage'; // Might need .jsx extension
import BlogPage from './pages/BlogPage'; // Might need .jsx extension
import DonatePage from './pages/DonatePage'; // Might need .jsx extension
import GetInvolvedPage from './pages/GetInvolvedPage'; // This exists as .jsx
import ContactPage from './pages/ContactPage'; // Might need .jsx extension
import AdminDashboard from './pages/AdminDashboard'; // Might need .jsx extension
import NotFoundPage from './pages/NotFoundPage'; // This exists as .tsx

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

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