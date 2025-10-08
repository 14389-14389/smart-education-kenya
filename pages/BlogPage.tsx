import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { BLOG_POSTS } from '../constants';

const BlogPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-bright-blue-800">Our Blog</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Stories, insights, and updates from the heart of our mission.
            </p>
          </div>

          {/* Dynamic blog posts */}
          <div className="max-w-4xl mx-auto space-y-12">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                className="bg-gray-50 rounded-lg shadow-lg overflow-hidden md:flex transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="md:w-1/3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <h2 className="text-2xl font-bold text-bright-blue-700 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                  <a
                    href="/Mentorship.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bright-blue-600 hover:underline mt-4 font-semibold self-start"
                  >
                    Read More &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Static blog highlights */}
          <div className="max-w-4xl mx-auto mt-16 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-bright-blue-700">
                Get to know more
              </h2>
              <section className="mt-2">
                <h3 className="text-xl font-semibold">
                  <em>The Ripple Effect: How Mentorship Transforms a Community</em>
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
                <h3 className="text-xl font-semibold">
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
                <h3 className="text-xl font-semibold">
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
