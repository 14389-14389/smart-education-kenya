
import React, { useState, useEffect } from 'react';

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after a short delay to allow the component to render first
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ease-in ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default AnimatedPage;
