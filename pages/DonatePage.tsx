import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyhP4iCHR-t12uFvWFIM3Y8VL5Ju-q6jQ-3lLA5GvYwEStoNoBJk301XjrbkuVWm5j/exec';

const DonatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    amount: '',
    paymentMethod: 'M-Pesa',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        idNumber: '',
        amount: '',
        paymentMethod: 'M-Pesa',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting donation form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-bright-blue-800 mb-4">
            Support Our Mission
          </h1>

          {/* 🌟 Encouraging Message */}
          <p className="text-center max-w-2xl mx-auto text-gray-700 mb-8">
            Your contribution goes a long way in transforming the future of young learners across Kenya.
            Together, we can create opportunities, inspire hope, and build a brighter tomorrow through education.
            Every shilling counts, and your support truly matters. 💙
          </p>

          {/* 💰 Donation Methods */}
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-10">
            <h2 className="text-2xl font-bold text-bright-blue-700 mb-4 text-center">
              Ways to Donate
            </h2>
            <div className="space-y-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">📱 M-Pesa (Send Money)</p>
                <p className="text-xl font-bold text-bright-blue-700">+254 742 180636</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">💳 PayPal</p>
                <p className="text-xl font-bold text-bright-blue-700">kevinmuli047@gmail.com</p>
              </div>
            </div>
          </div>

          {/* 📝 Donation Form */}
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-bright-blue-700 mb-4 text-center">
              Donation Form
            </h2>

            {isSubmitted ? (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 text-center">
                <p className="font-bold">Thank you for your generous support!</p>
                <p>We have received your donation information and a confirmation email will be sent shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">ID Number</label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Donation Amount (Ksh)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-bright-blue-600 text-white font-bold py-3 rounded-lg hover:bg-bright-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Donation Info'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default DonatePage;
