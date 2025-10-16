import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { SOCIAL_LINKS } from '../constants';
import { WhatsAppIcon, TwitterIcon, FacebookIcon } from '../components/icons';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_9k8tysd';
const TEMPLATE_ID = 'template_816153h';
const PUBLIC_KEY = 'F4MfniM-9p0bzvvwG';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const triggerToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    setTimeout(() => setToast(null), 4500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const plainMessage = `
----------------------------------------
          New Contact Form Submission
----------------------------------------

Hi Empower Them Team,

You have received a new message via your website contact form. Here are the details:

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

----------------------------------------
Please respond to the sender at your earliest convenience.

Best regards,
Empower Them Website

(This is an automated message sent from the Empower Them website contact form.)
----------------------------------------
`;

    emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        message: plainMessage,
      },
      PUBLIC_KEY
    )
    .then(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      triggerToast('success', 'Your message has been sent successfully!');
      setTimeout(() => setIsSubmitted(false), 6000);
    })
    .catch(err => {
      console.error('Email sending error:', err);
      triggerToast('error', 'Failed to send message. Please try again later.');
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <AnimatedPage>
      <div className="py-16 sm:py-20 bg-gray-50 relative">
        {toast && (
          <div
            className={`fixed bottom-5 right-5 px-6 py-4 rounded shadow-lg text-white font-semibold transform transition-transform duration-500 ${
              showToast ? 'translate-x-0 opacity-100' : 'translate-x-40 opacity-0'
            }`}
            style={{ backgroundColor: toast.type === 'success' ? '#38a169' : '#e53e3e' }}
          >
            {toast.message}
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-bright-blue-800">Contact Us</h1>
            <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
              We'd love to hear from you. Whether you have a question, a suggestion, or want to partner with us, please reach out.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-bright-blue-700 mb-6">Send us a Message</h2>
              {isSubmitted ? (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
                  <p className="font-bold">Thank you!</p>
                  <p>Your message has been sent successfully. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bright-blue-500 focus:border-bright-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bright-blue-500 focus:border-bright-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bright-blue-500 focus:border-bright-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-bright-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-bright-blue-700 transition transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-bright-blue-700 mb-4">Contact Information</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:empowerthem01@gmail.com" className="text-bright-blue-600 hover:underline">empowerthem01@gmail.com</a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+254742180636" className="text-bright-blue-600 hover:underline">+254 742 180 636</a>
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> Kibauni, Mwala, Machakos County, Kenya
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-bright-blue-700 mb-4">Connect With Us</h3>
                <div className="flex space-x-6 justify-start">
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition">
                    <WhatsAppIcon />
                  </a>
                  <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition">
                    <TwitterIcon />
                  </a>
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition">
                    <FacebookIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ContactPage;
