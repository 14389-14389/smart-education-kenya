import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { BLOG_POSTS } from '../constants';

const BlogPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-bright-blue-800">
              Our Blog
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mt-4 max-w-3xl mx-auto">
              Inspiring stories, educational insights, and community impact from Smart Education’s journey to empower lives through learning.
            </p>
          </div>

          {/* Blog Posts */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="group bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden h-56">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-bright-blue-700 mb-3">
                      {post.title}
                    </h2>
                    <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <a
                    href={post.link || "/Mentorship.html"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-bright-blue-600 font-semibold hover:text-bright-blue-800 transition-colors mt-auto"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Highlights */}
          <div className="max-w-6xl mx-auto mt-20 border-t border-gray-200 pt-12">
            <h2 className="text-3xl font-bold text-bright-blue-800 text-center mb-10">
              More from Smart Education
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <section className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <h3 className="text-xl font-semibold text-bright-blue-700 mb-2">
                  The Ripple Effect: How Mentorship Transforms a Community
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover how mentorship builds confidence and creates lasting impact in communities.
                </p>
                <a
                  href="/Mentorship.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bright-blue-600 font-semibold hover:underline"
                >
                  Learn more →
                </a>
              </section>

              <section className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <h3 className="text-xl font-semibold text-bright-blue-700 mb-2">
                  Education as the Great Equalizer in Rural Kenya
                </h3>
                <p className="text-gray-600 mb-4">
                  How quality education empowers rural youth and transforms entire communities.
                </p>
                <a
                  href="/pages/rural-education.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bright-blue-600 font-semibold hover:underline"
                >
                  Learn more →
                </a>
              </section>

              <section className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <h3 className="text-xl font-semibold text-bright-blue-700 mb-2">
                  Why Keeping Girls in School is a National Priority
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore how Smart Education empowers young girls to stay in school and thrive.
                </p>
                <a
                  href="/pages/girls-education.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bright-blue-600 font-semibold hover:underline"
                >
                  Read more →
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
