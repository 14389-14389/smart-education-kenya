import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { BLOG_POSTS } from '../constants';

const BlogPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-bright-blue-800">
              Our Blog
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Stories, insights, and updates from the heart of our mission.
            </p>
          </div>

          {/* Dynamic Blog Posts */}
          <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transform hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform duration-300"
              >
                {/* Image Section */}
                <div className="md:w-1/3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 md:w-2/3 flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-bright-blue-700 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {post.excerpt}
                  </p>
                  <a
                    href="/Mentorship.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bright-blue-600 hover:underline mt-4 font-semibold self-start"
                  >
                    Read More &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Static Blog Highlights */}
          <div className="max-w-5xl mx-auto mt-16 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-bright-blue-700 mb-2">
                Get to know more
              </h2>
              <section>
                <h3 className="text-lg sm:text-xl font-semibold italic">
                  The Ripple Effect: How Mentorship Transforms a Community
                </h3>
                <a
                  href="/Mentorship.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bright-blue-600 hover:underline"
                >
                  Read more on mentorship programmes
                </a>
              </section>
            </div>

            <div>
              <section>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Education as the Great Equalizer in Rural Kenya
                </h3>
                <a
                  href="/pages/rural-education.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bright-blue-600 hover:underline"
                >
                  Education as the Great Equalizer in Rural Kenya
                </a>
              </section>
            </div>

            <div>
              <section>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Why Keeping Girls in School is a National Priority
                </h3>
                <a
                  href="/pages/girls-education.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bright-blue-600 hover:underline"
                >
                  Why Keeping Girls in School is a National Priority
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default BlogPage;
