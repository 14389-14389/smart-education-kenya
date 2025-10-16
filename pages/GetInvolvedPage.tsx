import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';

// ✅ Google Apps Script Web App URLs
const VOLUNTEER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrUdLqpOtK2ieKv60JakSa00cgWaYzRAn9DvWLSSm5mtDBU3IdLFP5e5ZgCRRbjG8R/exec';
const PARTNER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlRNf35BOzLwVY6AiGzkYYM13xqeQvQw-AxxxT0UCiVRL1fM3j9MHNM6ScGoBg7E3I/exec';

const GetInvolvedPage: React.FC = () => {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  const [volunteerData, setVolunteerData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });

  const [partnerData, setPartnerData] = useState({
    organization: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: '',
  });

  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVolunteerData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePartnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPartnerData((prev) => ({ ...prev, [name]: value }));
  };

  const submitVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(VOLUNTEER_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerData),
      });
      setVolunteerSubmitted(true);
      setVolunteerData({ fullName: '', email: '', phone: '', interest: '', message: '' });
    } catch (error) {
      console.error('Volunteer submission failed:', error);
      alert('Failed to submit volunteer form. Please try again.');
    }
    setLoading(false);
  };

  const submitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(PARTNER_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerData),
      });
      setPartnerSubmitted(true);
      setPartnerData({ organization: '', contactPerson: '', email: '', phone: '', partnershipType: '', message: '' });
    } catch (error) {
      console.error('Partner submission failed:', error);
      alert('Failed to submit partner form. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AnimatedPage>
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl font-bold text-center text-bright-blue-800 mb-6">Get Involved</h1>

          {/* Motivational Section */}
          <div className="text-center mb-10">
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              🌟 <strong>Your time, voice, and partnership can spark a brighter future for thousands of young learners.</strong><br />
              Whether you choose to volunteer or collaborate with us, your involvement goes far beyond today — it plants seeds of hope, opportunity, and lasting change.
            </p>
            <p className="mt-4 text-gray-600 italic">
              Join our mission to empower the next generation. <strong>Be the reason a dream comes true.</strong>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
            <button
              onClick={() => {
                setShowVolunteerForm(!showVolunteerForm);
                setShowPartnerForm(false);
              }}
              className="flex-1 bg-bright-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-bright-blue-700 transition"
            >
              Volunteer With Us
            </button>

            <button
              onClick={() => {
                setShowPartnerForm(!showPartnerForm);
                setShowVolunteerForm(false);
              }}
              className="flex-1 bg-yellow-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition"
            >
              Partner With Us
            </button>
          </div>

          {/* Volunteer Form */}
          {showVolunteerForm && (
            <div className="bg-white p-8 rounded-xl shadow-lg mb-12 transition-all duration-500">
              <h2 className="text-2xl font-bold text-bright-blue-700 mb-4 text-center">Volunteer Sign-Up</h2>
              {volunteerSubmitted ? (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded text-center">
                  ✅ Thank you for signing up to volunteer! We'll be in touch soon.
                </div>
              ) : (
                <form onSubmit={submitVolunteer} className="space-y-4">
                  <input name="fullName" placeholder="Full Name" value={volunteerData.fullName} onChange={handleVolunteerChange} required className="w-full border rounded p-2" />
                  <input name="email" type="email" placeholder="Email" value={volunteerData.email} onChange={handleVolunteerChange} required className="w-full border rounded p-2" />
                  <input name="phone" placeholder="Phone Number" value={volunteerData.phone} onChange={handleVolunteerChange} required className="w-full border rounded p-2" />
                  <input name="interest" placeholder="Area of Interest (e.g. Mentoring, Events)" value={volunteerData.interest} onChange={handleVolunteerChange} required className="w-full border rounded p-2" />
                  <textarea name="message" placeholder="Message (Optional)" value={volunteerData.message} onChange={handleVolunteerChange} rows={3} className="w-full border rounded p-2"></textarea>
                  <button type="submit" disabled={loading} className="w-full bg-bright-blue-600 text-white py-2 rounded-lg font-bold hover:bg-bright-blue-700 transition">
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Partner Form */}
          {showPartnerForm && (
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500">
              <h2 className="text-2xl font-bold text-yellow-600 mb-4 text-center">Partner With Us</h2>
              {partnerSubmitted ? (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded text-center">
                  ✅ Thank you for your interest in partnering with us. We will reach out shortly.
                </div>
              ) : (
                <form onSubmit={submitPartner} className="space-y-4">
                  <input name="organization" placeholder="Organization / Name" value={partnerData.organization} onChange={handlePartnerChange} required className="w-full border rounded p-2" />
                  <input name="contactPerson" placeholder="Contact Person" value={partnerData.contactPerson} onChange={handlePartnerChange} required className="w-full border rounded p-2" />
                  <input name="email" type="email" placeholder="Email" value={partnerData.email} onChange={handlePartnerChange} required className="w-full border rounded p-2" />
                  <input name="phone" placeholder="Phone Number" value={partnerData.phone} onChange={handlePartnerChange} required className="w-full border rounded p-2" />
                  <input name="partnershipType" placeholder="Type of Partnership (e.g. CSR, Sponsorship)" value={partnerData.partnershipType} onChange={handlePartnerChange} required className="w-full border rounded p-2" />
                  <textarea name="message" placeholder="Message (Optional)" value={partnerData.message} onChange={handlePartnerChange} rows={3} className="w-full border rounded p-2"></textarea>
                  <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-white py-2 rounded-lg font-bold hover:bg-yellow-600 transition">
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default GetInvolvedPage;
