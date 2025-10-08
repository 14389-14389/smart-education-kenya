import React from 'react';
import AnimatedPage from '../components/AnimatedPage';

const AboutPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h1 className="text-4xl font-bold text-bright-blue-800">Our Story</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Smart Education was born from a shared passion to uplift Kenya's youth. Discover the visionaries who started it all.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-start">
            {/* Lucky Kitonyi */}
            <div className="bg-white pt-20 p-8 rounded-lg shadow-xl flex flex-col items-center text-center relative">
              <img
                src="/assets/lucky kitonyi.jpg"
                alt="Lucky Kitonyi, Founder"
                className="rounded-full shadow-2xl w-40 h-40 object-cover border-8 border-white absolute -top-20"
              />
              <h2 className="text-3xl font-bold text-bright-blue-700 mb-2">Lucky Kitonyi</h2>
              <p className="font-medium text-gray-500 mb-4">Founder & Visionary</p>
              <div className="text-left space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Eng. Lucky Kitonyi, a proud native of Kibauni Ward in Mwala, is the visionary founder of Smart Education. Having grown up in the very community she now serves, Lucky witnessed firsthand the immense potential and the significant challenges faced by young students. Her personal journey fueled a deep-seated passion to create pathways for others to succeed.
                </p>
                <p>
                  She started this initiative to bridge the gap between potential and opportunity, believing that with the right mentorship, motivation, and resources, every child can achieve their dreams.
                </p>
                <p className="font-semibold text-center pt-4 italic text-bright-blue-800">
                  "We are not just giving handouts; we are lighting a fire of ambition and hope in the hearts of our future leaders."
                </p>
              </div>
            </div>

            {/* Kevin Muli */}
            <div className="bg-white pt-20 p-8 rounded-lg shadow-xl flex flex-col items-center text-center relative">
              <img
                src="/assets/kevinmuli1.jpg"
                alt="Kevin Muli, Co-Founder"
                className="rounded-full shadow-2xl w-40 h-40 object-cover border-8 border-white absolute -top-20"
              />
              <h2 className="text-3xl font-bold text-bright-blue-700 mb-2">Kevin Muli</h2>
              <p className="font-medium text-gray-500 mb-4">Co-Founder & Tech Lead</p>
              <div className="text-left space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Kevin Muli, a skilled Software Engineer also hailing from Kibauni, co-founded Smart Education with a shared vision. He brings a powerful perspective on the role of technology and modern skills in education and is deeply passionate about mentoring young minds to thrive in a digital world.
                </p>
                <p>
                  His expertise helps shape programs that are not only inspirational but also practical, preparing students for future careers and ensuring they have access to the same opportunities as their urban counterparts.
                </p>
                <p className="font-semibold text-center pt-4 italic text-bright-blue-800">
                  "By blending mentorship with technology, we can unlock unprecedented potential in our students."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AboutPage;