import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { GALLERY_IMAGES } from '../constants';
import { CloseIcon } from '../components/icons';

const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (src: string) => {
    setSelectedImage(src);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <AnimatedPage>
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-bright-blue-800">Our Gallery</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">A glimpse into our journey, our community, and the lives we've touched.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((image) => (
              <div key={image.id} className="group cursor-pointer" onClick={() => openModal(image.src)}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-lg shadow-md transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged view" className="rounded-lg shadow-2xl max-h-[90vh]" />
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-200 transition"
              aria-label="Close image view"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default GalleryPage;
