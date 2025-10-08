import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

const HomePage: React.FC = () => {
  return (
    <AnimatedPage>
      {/* ✅ Hero Section */}
      <div
        className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: "url('/assets/home ui.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col items-center justify-center text-center transform-gpu">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4 animate-fade-in-down">
            Empowering Young Minds, Changing Futures
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mb-8 animate-fade-in-up">
            Our mission is to empower over 2,000 students in underserved areas to pursue education with passion through mentorship, motivation, and essential school materials.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Link
              to="/donate"
              className="w-full sm:w-auto bg-bright-blue-600 hover:bg-bright-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 text-center"
            >
              Donate Now
            </Link>
            <Link
              to="/get-involved"
              className="w-full sm:w-auto bg-white hover:bg-gray-200 text-bright-blue-700 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 text-center"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ What We Do Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-bright-blue-800 mb-4">
            Our Core Programs
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-12 text-base sm:text-lg">
            We focus on holistic development to ensure every student has the opportunity to succeed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-bright-blue-700 mb-2">
                Mentorship & Career Guidance
              </h3>
              <p className="text-gray-600">
                Connecting students with role models and equipping them with knowledge about future career paths to build confidence and ambition.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-bright-blue-700 mb-2">
                Student Awards & Recognition
              </h3>
              <p className="text-gray-600">
                Awarding top-performing and committed students to foster a spirit of excellence and keep them motivated.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-bright-blue-700 mb-2">
                Girls’ Dignity Program
              </h3>
              <p className="text-gray-600">
                Providing sanitary pads to ensure girls can attend school with dignity and without interruption.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-bright-blue-700 mb-2">
                Scholarship Assistance
              </h3>
              <p className="text-gray-600">
                Connecting deserving students with scholarship opportunities to remove financial barriers to education.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default HomePage;
