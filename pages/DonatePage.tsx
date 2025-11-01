import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyhP4iCHR-t12uFvWFIM3Y8VL5Ju-q6jQ-3lLA5GvYwEStoNoBJk301XjrbkuVWm5j/exec';
const API_URL = import.meta.env.VITE_API_URL;

const DonatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', // Changed from fullName to match backend
    email: '',
    phone: '',
    idNumber: '',
    amount: '',
    paymentMethod: 'M-Pesa',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setSubmitError('Please enter a valid donation amount.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🔄 Submitting donation data:', formData);

      // 1. Submit to MongoDB backend (primary storage)
      const mongoResponse = await fetch(`${API_URL}/api/donate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          amount: amount, // Ensure it's a number
          timestamp: new Date().toISOString()
        }),
      });

      const mongoResult = await mongoResponse.json();
      console.log('✅ MongoDB save result:', mongoResult);

      if (!mongoResponse.ok) {
        throw new Error(mongoResult.error || 'Failed to save to database');
      }

      // 2. Submit to Google Sheets (backup/legacy) - only if MongoDB succeeds
      try {
        console.log('📊 Attempting Google Sheets backup...');
        const sheetsResponse = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            ...formData,
            timestamp: new Date().toLocaleString(),
            source: 'Website Donation Form'
          }).toString()
        });
        
        console.log('✅ Google Sheets submission attempted');
      } catch (sheetsError) {
        console.warn('⚠️ Google Sheets submission failed:', sheetsError);
        // Continue anyway - MongoDB is primary storage
      }

      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        idNumber: '',
        amount: '',
        paymentMethod: 'M-Pesa',
        message: '',
      });

    } catch (error: any) {
      console.error('❌ Error submitting donation form:', error);
      setSubmitError(
        error.message || 
        'Failed to submit donation information. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick donation amount buttons
  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const setQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  return (
    <AnimatedPage>
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-bright-blue-800 mb-4">
            Support Our Mission
          </h1>

          {/* 🌟 Encouraging Message */}
          <p className="text-center max-w-2xl mx-auto text-gray-700 mb-8 text-lg leading-relaxed">
            Your contribution goes a long way in transforming the future of young learners across Kenya.
            Together, we can create opportunities, inspire hope, and build a brighter tomorrow through education.
            Every shilling counts, and your support truly matters. 💙
          </p>

          {/* 💰 Donation Methods */}
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-10 border border-blue-100">
            <h2 className="text-2xl font-bold text-bright-blue-700 mb-6 text-center">
              Ways to Donate
            </h2>
            <div className="space-y-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-800 mb-2">📱 M-Pesa (Send Money)</p>
                <p className="text-xl font-bold text-bright-blue-700">+254 742 180636</p>
                <p className="text-sm text-gray-600 mt-1">Name: SMART EDUCATION</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-800 mb-2">💳 PayPal</p>
                <p className="text-xl font-bold text-bright-blue-700">kevinmuli047@gmail.com</p>
                <p className="text-sm text-gray-600 mt-1">Send to: Kevin Muli</p>
              </div>
            </div>
          </div>

          {/* 📝 Donation Form */}
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-bright-blue-700 mb-6 text-center">
              Donation Form
            </h2>

            {submitError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <div className="flex items-center">
                  <span className="text-red-500 text-lg mr-2">⚠️</span>
                  <div>
                    <p className="font-bold">Submission Error</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            {isSubmitted ? (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded mb-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-green-500 text-2xl mr-2">✅</span>
                  <p className="font-bold text-lg">Thank you for your generous support!</p>
                </div>
                <p>We have received your donation information successfully.</p>
                <p className="text-sm mt-2">📧 A confirmation email will be sent shortly</p>
                <p className="text-sm">💾 Saved to our secure database</p>
                
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Make Another Donation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="National ID number"
                    />
                  </div>
                </div>

                {/* Quick Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Amount Selection (Ksh)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setQuickAmount(amount)}
                        className={`py-2 px-3 rounded-lg border transition ${
                          formData.amount === amount.toString()
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Amount (Ksh) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount in Kenyan Shillings"
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional message or dedication..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-bright-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-bright-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Donation Information'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Required fields. Your information is secure and will only be used for donation purposes.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default DonatePage;