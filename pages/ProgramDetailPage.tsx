import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROGRAMS_DATA } from '../constants';
import AnimatedPage from '../components/AnimatedPage';

const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const program = PROGRAMS_DATA.find(p => p.id === id);

  if (!program) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold text-red-600">Program Not Found</h1>
        <p className="mt-4 text-gray-600">The program you are looking for does not exist.</p>
        <Link to="/programs" className="mt-6 inline-block bg-bright-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-bright-blue-700 transition">
          Back to Our Programs
        </Link>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="bg-white">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${program.imageSrc})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {program.title}
            </h1>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-bright-blue-800 mb-6">About the Program</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                    {program.longDescription}
                </p>

                {program.objectives && (
                    <>
                        <h3 className="text-2xl font-bold text-bright-blue-700 mt-10 mb-4">Our Objectives</h3>
                        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
                            {program.objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className="text-center mt-12">
                 <Link to="/programs" className="inline-block bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition transform hover:scale-105">
                    &larr; Back to All Programs
                </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ProgramDetailPage;
