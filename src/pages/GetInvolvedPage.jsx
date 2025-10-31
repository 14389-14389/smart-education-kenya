import React, { useState, useEffect } from "react";
import api from "../api";

const GetInvolvedPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [entries, setEntries] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/get_involved", formData);
      alert("Thank you for getting involved!");
      setFormData({ name: "", email: "", message: "" });
      fetchEntries();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await api.get("/get_involved");
      setEntries(res.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Get Involved</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="How do you want to get involved?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>

      <h2 className="text-xl font-medium mb-2">Recent Submissions</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index} className="border-b py-2">
            <strong>{entry.name}</strong> ({entry.email}) — {entry.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetInvolvedPage;
