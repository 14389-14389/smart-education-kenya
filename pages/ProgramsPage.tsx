import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { PROGRAMS_DATA } from '../constants';
import { Link } from 'react-router-dom';

interface ProgramCardProps {
  id: string;
  imageSrc: string;
  title: string;
  description: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ id, imageSrc, title, description }) => (
  <Link to={`/programs/${id}`} className="block bg-white rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
    <img src={imageSrc} alt={title} className="w-full h-56 object-cover" />
    <div className="p-6">
      <h3 className="text-2xl font-bold text-bright-blue-800 mb-3 group-hover:text-bright-blue-600 transition">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </Link>
);

const ProgramsPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-bright-blue-800">Our Programs</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Creating a brighter future through targeted support and empowerment. Click on a program to learn more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {PROGRAMS_DATA.map((program) => (
              <ProgramCard key={program.id} id={program.id} title={program.title} imageSrc={program.imageSrc} description={program.shortDescription} />
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ProgramsPage;