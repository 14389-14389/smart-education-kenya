import React, { useState } from "react";

const GetInvolvedPage: React.FC = () => {
  // ✅ Google Apps Script URLs
  // ✅ Google Apps Script URLs
const VOLUNTEER_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyrUdLqpOtK2ieKv60JakSa00cgWaYzRAn9DvWLSSm5mtDBU3IdLFP5e5ZgCRRbjG8R/exec";
const PARTNER_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwlRNf35BOzLwVY6AiGzkYYM13xqeQvQw-AxxxT0UCiVRL1fM3j9MHNM6ScGoBg7E3I/exec";

// ✅ Flask + MongoDB URLs
const VOLUNTEER_API_URL = "http://127.0.0.1:5000/api/volunteer";
const PARTNER_API_URL = "http://127.0.0.1:5000/api/partner";


  // ✅ State for volunteer form
  const [volunteerData, setVolunteerData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  // ✅ State for partner form
  const [partnerData, setPartnerData] = useState({
    organization: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "",
    message: "",
  });

  // ✅ Control state
  const [loading, setLoading] = useState(false);
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // ---------------- VOLUNTEER FORM HANDLER ----------------
  const submitVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send to Flask + MongoDB
      const mongoResponse = fetch(VOLUNTEER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      // Send to Google Sheets
      const googleResponse = fetch(VOLUNTEER_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      // Wait for both to finish
      await Promise.all([mongoResponse, googleResponse]);

      setVolunteerSubmitted(true);
      alert("✅ Volunteer submission sent to MongoDB + Google Sheets!");
      setVolunteerData({
        fullName: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    } catch (error) {
      console.error("Volunteer submission failed:", error);
      alert("❌ Failed to submit volunteer form. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PARTNER FORM HANDLER ----------------
  const submitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send to Flask + MongoDB
      const mongoResponse = fetch(PARTNER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerData),
      });

      // Send to Google Sheets
      const googleResponse = fetch(PARTNER_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerData),
      });

      // Wait for both to finish
      await Promise.all([mongoResponse, googleResponse]);

      setPartnerSubmitted(true);
      alert("✅ Partner submission sent to MongoDB + Google Sheets!");
      setPartnerData({
        organization: "",
        contactPerson: "",
        email: "",
        phone: "",
        partnershipType: "",
        message: "",
      });
    } catch (error) {
      console.error("Partner submission failed:", error);
      alert("❌ Failed to submit partner form. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- JSX RETURN ----------------
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Get Involved with JuaHustle
      </h1>
      <p className="text-center mb-10 text-lg">
        Join us as a volunteer or partner and make an impact in your community.
      </p>

      {/* -------- VOLUNTEER FORM -------- */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Volunteer with Us
        </h2>
        <form onSubmit={submitVolunteer} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={volunteerData.fullName}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, fullName: e.target.value })
            }
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={volunteerData.email}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, email: e.target.value })
            }
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={volunteerData.phone}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, phone: e.target.value })
            }
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Area of Interest"
            value={volunteerData.interest}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, interest: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
          <textarea
            placeholder="Message"
            value={volunteerData.message}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, message: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            {loading ? "Submitting..." : "Submit Volunteer Form"}
          </button>
        </form>
        {volunteerSubmitted && (
          <p className="text-green-600 mt-3 text-center">
            ✅ Thank you for volunteering!
          </p>
        )}
      </div>

      {/* -------- PARTNER FORM -------- */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Partner with Us
        </h2>
        <form onSubmit={submitPartner} className="space-y-4">
          <input
            type="text"
            placeholder="Organization Name"
            value={partnerData.organization}
            onChange={(e) =>
              setPartnerData({ ...partnerData, organization: e.target.value })
            }
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Contact Person"
            value={partnerData.contactPerson}
            onChange={(e) =>
              setPartnerData({ ...partnerData, contactPerson: e.target.value })
            }
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={partnerData.email}
            onChange={(e) =>
              setPartnerData({ ...partnerData, email: e.target.value })
            }
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={partnerData.phone}
            onChange={(e) =>
              setPartnerData({ ...partnerData, phone: e.target.value })
            }
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Partnership Type"
            value={partnerData.partnershipType}
            onChange={(e) =>
              setPartnerData({
                ...partnerData,
                partnershipType: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md"
          />
          <textarea
            placeholder="Message"
            value={partnerData.message}
            onChange={(e) =>
              setPartnerData({ ...partnerData, message: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
          >
            {loading ? "Submitting..." : "Submit Partner Form"}
          </button>
        </form>
        {partnerSubmitted && (
          <p className="text-green-600 mt-3 text-center">
            ✅ Thank you for partnering with us!
          </p>
        )}
      </div>
    </div>
  );
};

export default GetInvolvedPage;
