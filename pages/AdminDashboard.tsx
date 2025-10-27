import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// -----------------
// Firebase Config
// -----------------
const firebaseConfig = {
  apiKey: "<YOUR_FIREBASE_API_KEY>",
  authDomain: "<YOUR_FIREBASE_AUTH_DOMAIN>",
  projectId: "<YOUR_FIREBASE_PROJECT_ID>",
  storageBucket: "<YOUR_FIREBASE_STORAGE_BUCKET>",
  messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
  appId: "<YOUR_APP_ID>"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');

  const [volunteerSortKey, setVolunteerSortKey] = useState<string>('fullName');
  const [volunteerSortAsc, setVolunteerSortAsc] = useState(true);

  const [partnerSortKey, setPartnerSortKey] = useState<string>('organization');
  const [partnerSortAsc, setPartnerSortAsc] = useState(true);

  const correctPassword = 'smart123';

  // -----------------
  // Login
  // -----------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('❌ Incorrect password');
    }
  };

  // -----------------
  // Fetch data
  // -----------------
  useEffect(() => {
    if (authenticated) {
      fetchVolunteers();
      fetchPartners();
    }
  }, [authenticated]);

  const fetchVolunteers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/view/volunteer');
      setVolunteers(res.data.data);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/view/partner');
      setPartners(res.data.data);
    } catch (err) {
      console.error('Error fetching partners:', err);
    }
  };

  // -----------------
  // Delete entry
  // -----------------
  const handleDelete = async (formType: 'volunteer' | 'partner', index: number) => {
    const item = formType === 'volunteer' ? volunteers[index] : partners[index];
    if (!window.confirm(`Are you sure you want to delete this ${formType}?`)) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/api/delete/${formType}/${item.email}`);
      if (formType === 'volunteer') {
        const newVols = [...volunteers];
        newVols.splice(index, 1);
        setVolunteers(newVols);
      } else {
        const newPartners = [...partners];
        newPartners.splice(index, 1);
        setPartners(newPartners);
      }
      alert('Deleted successfully!');
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Deletion failed!');
    }
  };

  // -----------------
  // Inline Edit
  // -----------------
  const handleEditChange = (formType: 'volunteer' | 'partner', index: number, field: string, value: string) => {
    if (formType === 'volunteer') {
      const updated = [...volunteers];
      updated[index][field] = value;
      setVolunteers(updated);
    } else {
      const updated = [...partners];
      updated[index][field] = value;
      setPartners(updated);
    }
  };

  const handleSave = async (formType: 'volunteer' | 'partner', index: number) => {
    const item = formType === 'volunteer' ? volunteers[index] : partners[index];
    try {
      await axios.put(`http://127.0.0.1:5000/api/update/${formType}/${item.email}`, item);
      alert('Updated successfully!');
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Update failed!');
    }
  };

  // -----------------
  // Firebase Upload
  // -----------------
  const handleFileUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      const fileRef = ref(storage, `resources/${uploadFile.name}`);
      await uploadBytes(fileRef, uploadFile);
      const url = await getDownloadURL(fileRef);
      alert(`File uploaded successfully! URL: ${url}`);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed!');
    } finally {
      setUploading(false);
      setUploadFile(null);
    }
  };

  // -----------------
  // Sorting helpers
  // -----------------
  const sortData = (data: any[], key: string, asc: boolean) => {
    return [...data].sort((a, b) => {
      if (!a[key]) return 1;
      if (!b[key]) return -1;
      return asc
        ? a[key].toString().localeCompare(b[key].toString())
        : b[key].toString().localeCompare(a[key].toString());
    });
  };

  // -----------------
  // Login View
  // -----------------
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Admin Login</h1>
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-lg p-6 w-80"
        >
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // -----------------
  // Admin Dashboard View
  // -----------------
  const filteredVolunteers = sortData(
    volunteers.filter(v =>
      v.fullName.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.email.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.interest.toLowerCase().includes(volunteerSearch.toLowerCase())
    ),
    volunteerSortKey,
    volunteerSortAsc
  );

  const filteredPartners = sortData(
    partners.filter(p =>
      p.organization.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.partnershipType.toLowerCase().includes(partnerSearch.toLowerCase())
    ),
    partnerSortKey,
    partnerSortAsc
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Volunteer Submissions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Volunteer Submissions</h2>
        <input
          type="text"
          placeholder="Search volunteers..."
          value={volunteerSearch}
          onChange={(e) => setVolunteerSearch(e.target.value)}
          className="mb-2 px-2 py-1 border rounded w-64"
        />
        {filteredVolunteers.length === 0 ? (
          <p className="text-gray-600">No volunteer submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200 cursor-pointer">
                  {['fullName', 'email', 'phone', 'interest'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 border"
                      onClick={() => {
                        if (volunteerSortKey === col) setVolunteerSortAsc(!volunteerSortAsc);
                        else {
                          setVolunteerSortKey(col);
                          setVolunteerSortAsc(true);
                        }
                      }}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                      {volunteerSortKey === col ? (volunteerSortAsc ? ' 🔼' : ' 🔽') : ''}
                    </th>
                  ))}
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((v, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-4 py-2">
                      <input
                        value={v.fullName}
                        onChange={(e) => handleEditChange('volunteer', idx, 'fullName', e.target.value)}
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">{v.email}</td>
                    <td className="border px-4 py-2">
                      <input
                        value={v.phone}
                        onChange={(e) => handleEditChange('volunteer', idx, 'phone', e.target.value)}
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        value={v.interest}
                        onChange={(e) => handleEditChange('volunteer', idx, 'interest', e.target.value)}
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleSave('volunteer', idx)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete('volunteer', idx)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Partner Submissions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Partner Submissions</h2>
        <input
          type="text"
          placeholder="Search partners..."
          value={partnerSearch}
          onChange={(e) => setPartnerSearch(e.target.value)}
          className="mb-2 px-2 py-1 border rounded w-64"
        />
        {filteredPartners.length === 0 ? (
          <p className="text-gray-600">No partner submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200 cursor-pointer">
                  {['organization', 'contactPerson', 'email', 'phone', 'partnershipType'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 border"
                      onClick={() => {
                        if (partnerSortKey === col) setPartnerSortAsc(!partnerSortAsc);
                        else {
                          setPartnerSortKey(col);
                          setPartnerSortAsc(true);
                        }
                      }}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                      {partnerSortKey === col ? (partnerSortAsc ? ' 🔼' : ' 🔽') : ''}
                    </th>
                  ))}
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((p, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-4 py-2">
                      <input
                        value={p.organization}
                        onChange={(e) => handleEditChange('partner', idx, 'organization', e.target.value)}
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        value={p.contactPerson}
                        onChange={(e) => handleEditChange('partner', idx, 'contactPerson', e.target.value)}
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">{p.email}</td>
                    <td className="border px-4 py-2">
                      <input
                        value={p.phone}
                        onChange={(e) => handleEditChange('partner', idx, 'phone', e.target.value)}
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        value={p.partnershipType}
                        onChange={(e) => handleEditChange('partner', idx, 'partnershipType', e.target.value)}
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleSave('partner', idx)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete('partner', idx)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Upload Resources */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Upload Resources</h2>
        <input
          type="file"
          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <button
          onClick={handleFileUpload}
          disabled={!uploadFile || uploading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </section>
    </div>
  );
};

export default AdminDashboard;
