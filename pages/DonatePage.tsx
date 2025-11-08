import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyhP4iCHR-t12uFvWFIM3Y8VL5Ju-q6jQ-3lLA5GvYwEStoNoBJk301XjrbkuVWm5j/exec';
const API_URL = import.meta.env.VITE_API_URL;

const DonatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    amount: '',
    currency: 'KES',
    paymentMethod: 'M-Pesa',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);

  // Currency options
  const currencies = [
    { code: 'KES', symbol: 'Ksh', name: 'Kenyan Shilling', rate: 1 },
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0078 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0072 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0062 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate receipt PDF
  const generateReceipt = (donationData: any) => {
    const receiptContent = `
      SMART EDUCATION DONATION RECEIPT
      
      Receipt No: SE-${Date.now()}
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}
      
      Donor Information:
      Name: ${donationData.fullName}
      Email: ${donationData.email}
      Phone: ${donationData.phone}
      ID Number: ${donationData.idNumber}
      
      Donation Details:
      Amount: ${donationData.currency} ${parseFloat(donationData.amount).toLocaleString()}
      Payment Method: ${donationData.paymentMethod}
      ${donationData.message ? `Message: ${donationData.message}` : ''}
      
      Thank you for your generous support!
      
      Smart Education
      Empowering the next generation of leaders in Kenya
      Contact: +254 742 180636
      Email: empowerthem01@gmail.com
      
      This is an automated receipt. Please keep it for your records.
    `;

    return receiptContent;
  };

  // Download receipt as text file
  const downloadReceipt = (receiptContent: string, donorName: string) => {
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Smart-Education-Receipt-${donorName.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Send receipt via email (simulated - you'll need a backend service for real emails)
  const sendReceiptEmail = async (donationData: any, receiptContent: string) => {
    try {
      // This is a simulation - you'll need to implement actual email service
      console.log('Sending receipt email to:', donationData.email);
      
      // For now, we'll just log it. You can integrate with:
      // - SendGrid
      // - EmailJS
      // - Nodemailer (backend)
      // - Google Apps Script
      
      const emailData = {
        to: donationData.email,
        subject: 'Smart Education - Donation Receipt',
        receipt: receiptContent,
        donorName: donationData.fullName,
        amount: donationData.amount,
        currency: donationData.currency
      };
      
      // Example: Send to your backend API for email processing
      await fetch(`${API_URL}/api/send-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
      
    } catch (error) {
      console.warn('Failed to send email receipt:', error);
      // Don't fail the main submission if email fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate all required fields
    if (!formData.fullName.trim()) {
      setSubmitError('Full Name is required.');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0 || isNaN(amount)) {
      setSubmitError('Please enter a valid donation amount.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🔄 Starting donation submission...');
      
      // Prepare data for backend
      const donationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        idNumber: formData.idNumber.trim(),
        amount: amount,
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        message: formData.message.trim(),
        timestamp: new Date().toISOString()
      };

      console.log('📤 Sending data to backend:', donationData);

      // 1. Submit to MongoDB backend
      const mongoResponse = await fetch(`${API_URL}/api/donate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData),
      });

      const mongoResult = await mongoResponse.json();
      console.log('✅ MongoDB response data:', mongoResult);

      if (!mongoResponse.ok) {
        const errorMsg = mongoResult.error || mongoResult.message || mongoResult.details || 'Failed to save to database';
        throw new Error(errorMsg);
      }

      // 2. Generate and store receipt data
      const receiptContent = generateReceipt(donationData);
      setReceiptData({
        content: receiptContent,
        donorName: donationData.fullName,
        amount: donationData.amount,
        currency: donationData.currency
      });

      // 3. Send receipt email
      await sendReceiptEmail(donationData, receiptContent);

      // 4. Submit to Google Sheets (backup)
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...donationData,
            timestamp: new Date().toLocaleString('en-KE'),
            source: 'Website Donation Form'
          })
        });
        console.log('✅ Google Sheets submission attempted');
      } catch (sheetsError) {
        console.warn('⚠️ Google Sheets submission failed:', sheetsError);
      }

      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        idNumber: '',
        amount: '',
        currency: 'KES',
        paymentMethod: 'M-Pesa',
        message: '',
      });

      console.log('🎉 Donation submitted successfully!');

    } catch (error: any) {
      console.error('❌ Error submitting donation form:', error);
      setSubmitError(error.message || 'Failed to submit donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick donation amount buttons in KES
  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const setQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  // Get current currency symbol
  const currentCurrency = currencies.find(c => c.code === formData.currency);
  const currencySymbol = currentCurrency?.symbol || 'Ksh';

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
                <p className="text-lg font-semibold text-gray-800 mb-2">📱 M-Pesa (Till number)</p>
                <p className="text-xl font-bold text-bright-blue-700">3311202</p>
                <p className="text-sm text-gray-600 mt-1">Name: Kevin Muli</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-800 mb-2">💳 PayPal</p>
                <p className="text-xl font-bold text-bright-blue-700">kevinmuli047@gmail.com</p>
                <p className="text-sm text-gray-600 mt-1">Send to: Kevin Muli</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-800 mb-2">🏦 Bank Transfer</p>
                <p className="text-xl font-bold text-bright-blue-700">Contact us for bank details</p>
                <p className="text-sm text-gray-600 mt-1">Available for larger donations</p>
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
                    <p className="text-sm mt-1">Please check all fields and try again.</p>
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
                <p className="text-sm mt-2">📧 A confirmation email has been sent to you</p>
                <p className="text-sm">💾 Saved to our secure database</p>
                
                {receiptData && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold">Download your receipt:</p>
                    <button
                      onClick={() => downloadReceipt(receiptData.content, receiptData.donorName)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                    >
                      📄 Download Receipt
                    </button>
                  </div>
                )}
                
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
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
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

                {/* Currency Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency *
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} - {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
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
                      <option value="Credit Card">Credit Card</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Quick Amount Selection (KES only) */}
                {formData.currency === 'KES' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Amount Selection (KES)
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
                )}

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Amount ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter amount in ${currencySymbol}`}
                  />
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

                {/* Currency Conversion Note */}
                {formData.currency !== 'KES' && formData.amount && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Your donation of {currencySymbol}{parseFloat(formData.amount).toLocaleString()} {formData.currency} 
                      will be converted to Kenyan Shillings at the current exchange rate.
                    </p>
                  </div>
                )}

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
                  A receipt will be generated and sent to your email.
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