import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-block bg-bright-blue-600 hover:bg-bright-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mb-6"
        >
          Go to Homepage
        </Link>

        {/* Help Text */}
        <p className="text-gray-500 text-sm">
          Need help?{' '}
          <Link to="/contact" className="text-bright-blue-600 hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;