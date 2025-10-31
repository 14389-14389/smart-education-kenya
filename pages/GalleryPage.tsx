import React, { useState } from 'react';
import { GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  // Check if we have schoolGroups
  const schoolGroups = GALLERY_IMAGES.find(img => (img as any).schoolGroups)?.schoolGroups || [];
  
  const [activeSchoolIndex, setActiveSchoolIndex] = useState(0);

  // Function to render flat images (for backward compatibility)
  const renderFlatImages = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {GALLERY_IMAGES.map((img) => {
        if ((img as any).schoolGroups) return null; // skip schoolGroups here
        return (
          <div key={(img as any).id} className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={(img as any).src}
              alt={(img as any).alt}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            <p className="mt-2 text-gray-700 text-sm">{(img as any).shortDescription}</p>
            <p className="text-gray-400 text-xs">{(img as any).dateTaken}</p>
            {(img as any).otherInfo && <p className="text-gray-400 text-xs">{(img as any).otherInfo}</p>}
          </div>
        );
      })}
    </div>
  );

  // Function to render grouped images
  const renderGroupedImages = () => {
    if (!schoolGroups.length) return null;

    const activeSchool = schoolGroups[activeSchoolIndex];

    return (
      <div>
        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap justify-center">
          {schoolGroups.map((group, index) => (
            <button
              key={group.school}
              onClick={() => setActiveSchoolIndex(index)}
              className={`px-4 py-2 rounded-full font-semibold ${
                index === activeSchoolIndex
                  ? 'bg-bright-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {group.school}
            </button>
          ))}
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activeSchool.photos.map((photo) => (
            <div key={photo.src} className="overflow-hidden rounded-lg shadow-lg">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <p className="mt-2 text-gray-700 text-sm">{photo.shortDescription}</p>
              <p className="text-gray-400 text-xs">{photo.dateTaken}</p>
              {photo.otherInfo && <p className="text-gray-400 text-xs">{photo.otherInfo}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-bright-blue-800 mb-10">Gallery</h1>

      {/* Render grouped first if available */}
      {schoolGroups.length ? renderGroupedImages() : renderFlatImages()}
    </div>
  );
};

export default Gallery;
