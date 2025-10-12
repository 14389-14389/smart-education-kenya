import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { GALLERY_IMAGES } from '../constants';

const GalleryPage: React.FC = () => {
  return (
    <AnimatedPage>
      <section className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Our Gallery
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Explore special moments from our learning sessions, mentorship programs, and empowerment activities that uplift and inspire communities.
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              {/* Hover Description Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-center p-4 text-sm">
                {img.description}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
};

export default GalleryPage;
