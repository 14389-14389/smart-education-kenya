import React, { useState, useEffect } from 'react';
import axios from 'axios';

// -----------------
// Base API URL
// -----------------
const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ 
    id: string; 
    name: string; 
    originalName: string;
    url: string; 
    size: number;
    uploadDate: string;
  }[]>([]);

  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [donationSearch, setDonationSearch] = useState('');

  const [volunteerSortKey, setVolunteerSortKey] = useState<string>('fullName');
  const [volunteerSortAsc, setVolunteerSortAsc] = useState(true);

  const [partnerSortKey, setPartnerSortKey] = useState<string>('organization');
  const [partnerSortAsc, setPartnerSortAsc] = useState(true);

  const [donationSortKey, setDonationSortKey] = useState<string>('createdAt');
  const [donationSortAsc, setDonationSortAsc] = useState(true);

  const [newVolunteer, setNewVolunteer] = useState({
    fullName: '', email: '', phone: '', interest: '', message: ''
  });
  
  const [newPartner, setNewPartner] = useState({
    organization: '', contactPerson: '', email: '', phone: '', partnershipType: '', message: ''
  });

  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const correctPassword = 'smart123';

  // -----------------
  // Download Functions
  // -----------------
  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape quotes and wrap in quotes if contains comma
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadVolunteers = () => {
    const headers = ['fullName', 'email', 'phone', 'interest', 'message', 'createdAt'];
    downloadCSV(volunteers, `volunteers-${new Date().toISOString().split('T')[0]}.csv`, headers);
  };

  const downloadPartners = () => {
    const headers = ['organization', 'contactPerson', 'email', 'phone', 'partnershipType', 'message', 'createdAt'];
    downloadCSV(partners, `partners-${new Date().toISOString().split('T')[0]}.csv`, headers);
  };

  const downloadDonations = () => {
    const headers = ['fullName', 'email', 'phone', 'idNumber', 'amount', 'currency', 'paymentMethod', 'message', 'timestamp'];
    downloadCSV(donations, `donations-${new Date().toISOString().split('T')[0]}.csv`, headers);
  };

  // -----------------
  // Health Check
  // -----------------
  const checkHealth = async () => {
    try {
      console.log('🏥 Checking live site health...');
      
      const [collectionsRes, volunteersRes, partnersRes] = await Promise.all([
        axios.get(`${API_URL}/api/health/collections`),
        axios.get(`${API_URL}/api/health/volunteers`),
        axios.get(`${API_URL}/api/health/partners`)
      ]);
      
      const healthData = {
        collections: collectionsRes.data,
        volunteers: volunteersRes.data,
        partners: partnersRes.data
      };
      
      console.log('Health check results:', healthData);
      setHealthStatus(healthData);
      
    } catch (err: any) {
      console.error('Health check failed:', err);
      setHealthStatus({ error: err.message });
    }
  };

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
      fetchDonations();
      fetchUploadedFiles();
      checkHealth();
    }
  }, [authenticated]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching volunteers from:', `${API_URL}/api/view/volunteer`);
      
      const res = await axios.get(`${API_URL}/api/view/volunteer`);
      console.log('📊 Volunteers API response:', res.data);
      
      if (res.data && res.data.data) {
        console.log(`✅ Loaded ${res.data.data.length} volunteers`);
        setVolunteers(res.data.data);
      } else {
        console.log('❌ No volunteers data found in response');
        console.log('Full response:', res.data);
        setVolunteers([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching volunteers:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 404) {
        alert('Volunteers API endpoint not found. Please check backend routes.');
      } else if (err.response?.status === 500) {
        alert('Server error when fetching volunteers. Check backend logs.');
      } else {
        alert('Network error when fetching volunteers. Check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching partners from:', `${API_URL}/api/view/partner`);
      
      const res = await axios.get(`${API_URL}/api/view/partner`);
      console.log('📊 Partners API response:', res.data);
      
      if (res.data && res.data.data) {
        console.log(`✅ Loaded ${res.data.data.length} partners`);
        setPartners(res.data.data);
      } else {
        console.log('❌ No partners data found in response');
        console.log('Full response:', res.data);
        setPartners([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching partners:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 404) {
        alert('Partners API endpoint not found. Please check backend routes.');
      } else if (err.response?.status === 500) {
        alert('Server error when fetching partners. Check backend logs.');
      } else {
        alert('Network error when fetching partners. Check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching donations from:', `${API_URL}/api/view/donations`);
      
      const res = await axios.get(`${API_URL}/api/view/donations`);
      console.log('📊 Donations API response:', res.data);
      
      if (res.data && res.data.data) {
        console.log(`✅ Loaded ${res.data.data.length} donations`);
        
        // Check what we're actually getting
        if (res.data.data.length > 0) {
          console.log('📊 First donation item:', res.data.data[0]);
          console.log('📊 Available keys:', Object.keys(res.data.data[0]));
        }
        
        setDonations(res.data.data);
      } else {
        console.log('❌ No donations data found in response');
        console.log('Full response:', res.data);
        setDonations([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching donations:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 404) {
        alert('Donations API endpoint not found. Please check backend routes.');
      } else if (err.response?.status === 500) {
        alert('Server error when fetching donations. Check backend logs.');
      } else {
        alert('Network error when fetching donations. Check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/files`);
      setUploadedFiles(response.data);
    } catch (err) {
      console.error("Error fetching uploaded files:", err);
    }
  };

  // -----------------
  // Add Volunteer / Partner
  // -----------------
  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/volunteer`, newVolunteer);
      alert('Volunteer added successfully!');
      setNewVolunteer({ fullName: '', email: '', phone: '', interest: '', message: '' });
      fetchVolunteers();
    } catch (err) {
      console.error('Add failed:', err);
      alert('Failed to add volunteer!');
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/partner`, newPartner);
      alert('Partner added successfully!');
      setNewPartner({ organization: '', contactPerson: '', email: '', phone: '', partnershipType: '', message: '' });
      fetchPartners();
    } catch (err) {
      console.error('Add failed:', err);
      alert('Failed to add partner!');
    }
  };

  // -----------------
  // Delete entry
  // -----------------
  const handleDelete = async (formType: 'volunteer' | 'partner' | 'donation', index: number) => {
    let item, itemName;
    
    if (formType === 'volunteer') {
      item = volunteers[index];
      itemName = `${item.fullName} (${item.email})`;
    } else if (formType === 'partner') {
      item = partners[index];
      itemName = `${item.organization} (${item.email})`;
    } else {
      item = donations[index];
      itemName = `${item.fullName || item.name || 'Unknown'} - ${item.amount} ${item.currency || 'KES'}`;
    }
    
    if (!window.confirm(`Are you sure you want to delete this ${formType}?\n${itemName}`)) return;

    try {
      if (formType === 'donation') {
        // Delete donation by ID or email
        const identifier = item._id || item.id || item.email;
        await axios.delete(`${API_URL}/api/delete/donation/${identifier}`);
        fetchDonations();
      } else {
        await axios.delete(`${API_URL}/api/delete/${formType}/${item.email}`);
        formType === 'volunteer' ? fetchVolunteers() : fetchPartners();
      }
      alert('Deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting entry:', err);
      alert(`Deletion failed! ${err.response?.data?.error || err.message}`);
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
      await axios.put(`${API_URL}/api/update/${formType}/${item.email}`, item);
      alert('Updated successfully!');
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Update failed!');
    }
  };

  // -----------------
  // MongoDB File Upload
  // -----------------
  const handleFileUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file first');
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      console.log('Uploading file:', uploadFile.name, 'Size:', uploadFile.size);
      
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });

      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        alert('File uploaded successfully!');
        setUploadFile(null);
        fetchUploadedFiles();
      } else {
        alert('Upload failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      console.error('Error response:', err.response?.data);
      alert('Upload failed: ' + (err.response?.data?.error || err.message || 'Network error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;
    try {
      await axios.delete(`${API_URL}/api/files/${fileId}`);
      alert("File deleted successfully!");
      fetchUploadedFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete file!");
    }
  };

  // -----------------
  // Sorting helpers
  // -----------------
  const sortData = (data: any[], key: string, asc: boolean) => {
    return [...data].sort((a, b) => {
      if (!a[key]) return 1;
      if (!b[key]) return -1;
      
      // Handle date sorting
      if (key.includes('date') || key.includes('Date') || key === 'createdAt' || key === 'timestamp') {
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        return asc ? dateA - dateB : dateB - dateA;
      }
      
      // Handle number sorting
      if (key === 'amount') {
        const numA = parseFloat(a[key]) || 0;
        const numB = parseFloat(b[key]) || 0;
        return asc ? numA - numB : numB - numA;
      }
      
      // Default string sorting
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
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded-lg p-6 w-80">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
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
      v.fullName?.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.email?.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.interest?.toLowerCase().includes(volunteerSearch.toLowerCase())
    ),
    volunteerSortKey,
    volunteerSortAsc
  );

  const filteredPartners = sortData(
    partners.filter(p =>
      p.organization?.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.contactPerson?.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.partnershipType?.toLowerCase().includes(partnerSearch.toLowerCase())
    ),
    partnerSortKey,
    partnerSortAsc
  );

  const filteredDonations = sortData(
    donations.filter(d =>
      (d.fullName?.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.name?.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.email?.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.amount?.toString().includes(donationSearch.toLowerCase()) ||
      d.paymentMethod?.toLowerCase().includes(donationSearch.toLowerCase()))
    ),
    donationSortKey,
    donationSortAsc
  );

  // Calculate total donations
  const totalDonations = donations.reduce((sum, donation) => {
    const amount = parseFloat(donation.amount) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard - Live</h1>
      
      {/* Health Status */}
      {healthStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">🏥 System Health</h3>
            <button 
              onClick={checkHealth}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Refresh Health
            </button>
          </div>
          
          {healthStatus.error ? (
            <div className="text-red-600">Health check failed: {healthStatus.error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`p-2 rounded ${healthStatus.collections?.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Database:</strong> {healthStatus.collections?.status || 'unknown'}
                <br/>
                Volunteers Collection: {healthStatus.collections?.has_volunteers_collection ? '✅' : '❌'}
                <br/>
                Partners Collection: {healthStatus.collections?.has_partners_collection ? '✅' : '❌'}
              </div>
              
              <div className={`p-2 rounded ${healthStatus.volunteers?.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Volunteers:</strong> {healthStatus.volunteers?.status || 'unknown'}
                <br/>
                Count: {healthStatus.volunteers?.count || 0}
                <br/>
                Has Data: {healthStatus.volunteers?.has_data ? '✅' : '❌'}
              </div>
              
              <div className={`p-2 rounded ${healthStatus.partners?.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Partners:</strong> {healthStatus.partners?.status || 'unknown'}
                <br/>
                Count: {healthStatus.partners?.count || 0}
                <br/>
                Has Data: {healthStatus.partners?.has_data ? '✅' : '❌'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            Loading data...
          </div>
        </div>
      )}

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Resources</h2>
        <div className="flex items-center gap-4 mb-6">
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            onClick={handleFileUpload}
            disabled={!uploadFile || uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Uploaded Files */}
        <div>
          <h3 className="text-lg font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h3>
          {uploadedFiles.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium truncate flex-1" title={file.originalName}>
                      {file.originalName}
                    </h4>
                    <button
                      onClick={() => handleDeleteFile(file.id, file.originalName)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Delete file"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <a
                    href={`${API_URL}${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 inline-block"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Volunteer Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Volunteer</h2>
        <form onSubmit={handleAddVolunteer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={newVolunteer.fullName}
            onChange={(e) => setNewVolunteer({...newVolunteer, fullName: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newVolunteer.email}
            onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newVolunteer.phone}
            onChange={(e) => setNewVolunteer({...newVolunteer, phone: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Interest"
            value={newVolunteer.interest}
            onChange={(e) => setNewVolunteer({...newVolunteer, interest: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <textarea
            placeholder="Message"
            value={newVolunteer.message}
            onChange={(e) => setNewVolunteer({...newVolunteer, message: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 md:col-span-2"
            rows={3}
          />
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 md:col-span-2">
            Add Volunteer
          </button>
        </form>
      </div>

      {/* Add Partner Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Partner</h2>
        <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Organization"
            value={newPartner.organization}
            onChange={(e) => setNewPartner({...newPartner, organization: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Contact Person"
            value={newPartner.contactPerson}
            onChange={(e) => setNewPartner({...newPartner, contactPerson: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newPartner.email}
            onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newPartner.phone}
            onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Partnership Type"
            value={newPartner.partnershipType}
            onChange={(e) => setNewPartner({...newPartner, partnershipType: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <textarea
            placeholder="Message"
            value={newPartner.message}
            onChange={(e) => setNewPartner({...newPartner, message: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 md:col-span-2"
            rows={3}
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 md:col-span-2">
            Add Partner
          </button>
        </form>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Volunteers ({filteredVolunteers.length})</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search volunteers..."
              value={volunteerSearch}
              onChange={(e) => setVolunteerSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
            />
            <button
              onClick={downloadVolunteers}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              📥 Download CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setVolunteerSortKey('fullName'); setVolunteerSortAsc(!volunteerSortAsc); }}>
                  Name {volunteerSortKey === 'fullName' && (volunteerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setVolunteerSortKey('email'); setVolunteerSortAsc(!volunteerSortAsc); }}>
                  Email {volunteerSortKey === 'email' && (volunteerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setVolunteerSortKey('phone'); setVolunteerSortAsc(!volunteerSortAsc); }}>
                  Phone {volunteerSortKey === 'phone' && (volunteerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setVolunteerSortKey('interest'); setVolunteerSortAsc(!volunteerSortAsc); }}>
                  Interest {volunteerSortKey === 'interest' && (volunteerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={volunteer.fullName || ''}
                      onChange={(e) => handleEditChange('volunteer', index, 'fullName', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="email"
                      value={volunteer.email || ''}
                      onChange={(e) => handleEditChange('volunteer', index, 'email', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={volunteer.phone || ''}
                      onChange={(e) => handleEditChange('volunteer', index, 'phone', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={volunteer.interest || ''}
                      onChange={(e) => handleEditChange('volunteer', index, 'interest', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave('volunteer', index)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete('volunteer', index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Partners ({filteredPartners.length})</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search partners..."
              value={partnerSearch}
              onChange={(e) => setPartnerSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
            />
            <button
              onClick={downloadPartners}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              📥 Download CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setPartnerSortKey('organization'); setPartnerSortAsc(!partnerSortAsc); }}>
                  Organization {partnerSortKey === 'organization' && (partnerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setPartnerSortKey('contactPerson'); setPartnerSortAsc(!partnerSortAsc); }}>
                  Contact Person {partnerSortKey === 'contactPerson' && (partnerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setPartnerSortKey('email'); setPartnerSortAsc(!partnerSortAsc); }}>
                  Email {partnerSortKey === 'email' && (partnerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setPartnerSortKey('partnershipType'); setPartnerSortAsc(!partnerSortAsc); }}>
                  Type {partnerSortKey === 'partnershipType' && (partnerSortAsc ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((partner, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={partner.organization || ''}
                      onChange={(e) => handleEditChange('partner', index, 'organization', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={partner.contactPerson || ''}
                      onChange={(e) => handleEditChange('partner', index, 'contactPerson', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="email"
                      value={partner.email || ''}
                      onChange={(e) => handleEditChange('partner', index, 'email', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={partner.partnershipType || ''}
                      onChange={(e) => handleEditChange('partner', index, 'partnershipType', e.target.value)}
                      className="w-full border-none bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave('partner', index)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete('partner', index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Donations ({filteredDonations.length})</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Amount: <span className="font-bold text-green-600">Ksh {totalDonations.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search donations..."
              value={donationSearch}
              onChange={(e) => setDonationSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
            />
            <button
              onClick={downloadDonations}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              📥 Download CSV
            </button>
          </div>
        </div>
        
        {filteredDonations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No donations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setDonationSortKey('fullName'); setDonationSortAsc(!donationSortAsc); }}>
                    Donor Name {donationSortKey === 'fullName' && (donationSortAsc ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setDonationSortKey('email'); setDonationSortAsc(!donationSortAsc); }}>
                    Email {donationSortKey === 'email' && (donationSortAsc ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setDonationSortKey('amount'); setDonationSortAsc(!donationSortAsc); }}>
                    Amount {donationSortKey === 'amount' && (donationSortAsc ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setDonationSortKey('paymentMethod'); setDonationSortAsc(!donationSortAsc); }}>
                    Method {donationSortKey === 'paymentMethod' && (donationSortAsc ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => { setDonationSortKey('timestamp'); setDonationSortAsc(!donationSortAsc); }}>
                    Date {donationSortKey === 'timestamp' && (donationSortAsc ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {donation.fullName || donation.name || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {donation.email || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {donation.currency || 'KES'} {parseFloat(donation.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {donation.paymentMethod || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {donation.timestamp ? new Date(donation.timestamp).toLocaleDateString() : 
                       donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDelete('donation', index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
      </div>
    </div>
  );
};

export default AdminDashboard;