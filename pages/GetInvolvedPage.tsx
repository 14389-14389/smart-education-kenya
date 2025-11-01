import React, { useState } from "react";

const GetInvolvedPage: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const VOLUNTEER_API_URL = `${API_URL}/api/volunteer`;
  const PARTNER_API_URL = `${API_URL}/api/partner`;

  const VOLUNTEER_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyrUdLqpOtK2ieKv60JakSa00cgWaYzRAn9DvWLSSm5mtDBU3IdLFP5e5ZgCRRbjG8R/exec";
  const PARTNER_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwlRNf35BOzLwVY6AiGzkYYM13xqeQvQw-AxxxT0UCiVRL1fM3j9MHNM6ScGoBg7E3I/exec";

  const [volunteerData, setVolunteerData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const [partnerData, setPartnerData] = useState({
    organization: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<string | null>(null);
  const [partnerStatus, setPartnerStatus] = useState<string | null>(null);

  const submitVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVolunteerStatus(null);

    try {
      // Backend submission
      const mongoRes = await fetch(VOLUNTEER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      if (!mongoRes.ok) throw new Error("Backend submission failed");

      // Google Sheets submission (no-cors, may not return a response)
      await fetch(VOLUNTEER_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      setVolunteerStatus("success");
      setVolunteerData({
        fullName: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setVolunteerStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const submitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPartnerStatus(null);

    try {
      const mongoRes = await fetch(PARTNER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerData),
      });

      if (!mongoRes.ok) throw new Error("Backend submission failed");

      await fetch(PARTNER_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerData),
      });

      setPartnerStatus("success");
      setPartnerData({
        organization: "",
        contactPerson: "",
        email: "",
        phone: "",
        partnershipType: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setPartnerStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Get Involved with us
      </h1>
      <p className="text-center mb-10 text-lg">
        Join us as a volunteer or partner and make an impact in your community.
      </p>

      {/* Volunteer Form */}
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
        {volunteerStatus === "success" && (
          <p className="text-green-600 mt-3 text-center">
            ✅ Volunteer form submitted successfully!
          </p>
        )}
        {volunteerStatus === "error" && (
          <p className="text-red-600 mt-3 text-center">
            ❌ Failed to submit volunteer form.
          </p>
        )}
      </div>

      {/* Partner Form */}
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
        {partnerStatus === "success" && (
          <p className="text-green-600 mt-3 text-center">
            ✅ Partner form submitted successfully!
          </p>
        )}
        {partnerStatus === "error" && (
          <p className="text-red-600 mt-3 text-center">
            ❌ Failed to submit partner form.
          </p>
        )}
      </div>
    </div>
  );
};

export default GetInvolvedPage;
