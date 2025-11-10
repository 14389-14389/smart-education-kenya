import React, { useState, useEffect } from 'react';
import axios from 'axios';

// -----------------
// Base API URL
// -----------------
const API_URL = import.meta.env.VITE_API_URL || 'https://smart-education-kenya.onrender.com';

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // TEMPORARY FIX: Hardcoded password for Netlify
  const correctPassword = 'Alfaromeo001@';

  // Debug Netlify environment
  useEffect(() => {
    console.log('🔐 Netlify Environment Status:');
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL || 'Not set');
    console.log('VITE_ADMIN_PASSWORD:', import.meta.env.VITE_ADMIN_PASSWORD ? 'Set' : 'Not set');
    console.log('Using password:', correctPassword);
  }, []);

  // -----------------
  // Download Functions
  // -----------------
  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
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
      const res = await axios.get(`${API_URL}/api/view/volunteer`);
      if (res.data && res.data.data) {
        setVolunteers(res.data.data);
      } else {
        setVolunteers([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching volunteers:', err);
      alert('Error fetching volunteers! Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/view/partner`);
      if (res.data && res.data.data) {
        setPartners(res.data.data);
      } else {
        setPartners([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching partners:', err);
      alert('Error fetching partners! Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/view/donations`);
      if (res.data && res.data.data) {
        setDonations(res.data.data);
      } else {
        setDonations([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching donations:', err);
      alert('Error fetching donations! Check console for details.');
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

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });

      if (response.data.success) {
        alert('File uploaded successfully!');
        setUploadFile(null);
        fetchUploadedFiles();
      } else {
        alert('Upload failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Upload error:', err);
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
      
      if (key.includes('date') || key.includes('Date') || key === 'createdAt' || key === 'timestamp') {
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        return asc ? dateA - dateB : dateB - dateA;
      }
      
      if (key === 'amount') {
        const numA = parseFloat(a[key]) || 0;
        const numB = parseFloat(b[key]) || 0;
        return asc ? numA - numB : numB - numA;
      }
      
      return asc
        ? a[key].toString().localeCompare(b[key].toString())
        : b[key].toString().localeCompare(a[key].toString());
    });
  };

  // Calculate statistics
  const totalDonations = donations.reduce((sum, donation) => {
    const amount = parseFloat(donation.amount) || 0;
    return sum + amount;
  }, 0);

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

  // -----------------
  // Login View
  // -----------------
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Enter your password to continue</p>
              
              {/* Netlify Status */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
                <p className="font-medium">Netlify Status:</p>
                <p>API: {import.meta.env.VITE_API_URL ? '✅ Connected' : '⚠️ Check Config'}</p>
                <p>Password: ⚠️ Using Temporary Setup</p>
              </div>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -----------------
  // Admin Dashboard View
  // -----------------
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'volunteers', name: 'Volunteers', icon: '👥' },
            { id: 'partners', name: 'Partners', icon: '🤝' },
            { id: 'donations', name: 'Donations', icon: '💰' },
            { id: 'files', name: 'File Manager', icon: '📁' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Volunteers</p>
                      <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Partners</p>
                      <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Donations</p>
                      <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Raised</p>
                      <p className="text-2xl font-bold text-gray-900">Ksh {totalDonations.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Status */}
              {healthStatus && (
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <h2 className="text-lg font-semibold mb-4">System Health</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border ${
                      healthStatus.collections?.status === 'healthy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Database</span>
                        <span className={`w-3 h-3 rounded-full ${
                          healthStatus.collections?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${
                      healthStatus.volunteers?.status === 'healthy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Volunteers API</span>
                        <span className={`w-3 h-3 rounded-full ${
                          healthStatus.volunteers?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${
                      healthStatus.partners?.status === 'healthy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Partners API</span>
                        <span className={`w-3 h-3 rounded-full ${
                          healthStatus.partners?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Volunteers Tab */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <h2 className="text-xl font-semibold">Volunteers ({filteredVolunteers.length})</h2>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      placeholder="Search volunteers..."
                      value={volunteerSearch}
                      onChange={(e) => setVolunteerSearch(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={downloadVolunteers}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition"
                    >
                      <span>📥</span>
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Name</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Email</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600 hidden sm:table-cell">Phone</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600 hidden md:table-cell">Interest</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVolunteers.map((volunteer, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={volunteer.fullName || ''}
                              onChange={(e) => handleEditChange('volunteer', index, 'fullName', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="email"
                              value={volunteer.email || ''}
                              onChange={(e) => handleEditChange('volunteer', index, 'email', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <input
                              type="text"
                              value={volunteer.phone || ''}
                              onChange={(e) => handleEditChange('volunteer', index, 'phone', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <input
                              type="text"
                              value={volunteer.interest || ''}
                              onChange={(e) => handleEditChange('volunteer', index, 'interest', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSave('volunteer', index)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => handleDelete('volunteer', index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
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

              {/* Add Volunteer Form */}
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h3 className="text-lg font-semibold mb-4">Add New Volunteer</h3>
                <form onSubmit={handleAddVolunteer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newVolunteer.fullName}
                    onChange={(e) => setNewVolunteer({...newVolunteer, fullName: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newVolunteer.email}
                    onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newVolunteer.phone}
                    onChange={(e) => setNewVolunteer({...newVolunteer, phone: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Interest"
                    value={newVolunteer.interest}
                    onChange={(e) => setNewVolunteer({...newVolunteer, interest: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Message"
                    value={newVolunteer.message}
                    onChange={(e) => setNewVolunteer({...newVolunteer, message: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                    rows={3}
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition md:col-span-2">
                    Add Volunteer
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <h2 className="text-xl font-semibold">Partners ({filteredPartners.length})</h2>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      placeholder="Search partners..."
                      value={partnerSearch}
                      onChange={(e) => setPartnerSearch(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={downloadPartners}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition"
                    >
                      <span>📥</span>
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Organization</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600 hidden md:table-cell">Contact</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Email</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600 hidden lg:table-cell">Type</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.map((partner, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={partner.organization || ''}
                              onChange={(e) => handleEditChange('partner', index, 'organization', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <input
                              type="text"
                              value={partner.contactPerson || ''}
                              onChange={(e) => handleEditChange('partner', index, 'contactPerson', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="email"
                              value={partner.email || ''}
                              onChange={(e) => handleEditChange('partner', index, 'email', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <input
                              type="text"
                              value={partner.partnershipType || ''}
                              onChange={(e) => handleEditChange('partner', index, 'partnershipType', e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSave('partner', index)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => handleDelete('partner', index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
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

              {/* Add Partner Form */}
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h3 className="text-lg font-semibold mb-4">Add New Partner</h3>
                <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Organization"
                    value={newPartner.organization}
                    onChange={(e) => setNewPartner({...newPartner, organization: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Person"
                    value={newPartner.contactPerson}
                    onChange={(e) => setNewPartner({...newPartner, contactPerson: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Partnership Type"
                    value={newPartner.partnershipType}
                    onChange={(e) => setNewPartner({...newPartner, partnershipType: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Message"
                    value={newPartner.message}
                    onChange={(e) => setNewPartner({...newPartner, message: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                    rows={3}
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition md:col-span-2">
                    Add Partner
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-xl font-semibold">Donations ({filteredDonations.length})</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Total Amount: <span className="font-bold text-green-600">Ksh {totalDonations.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      placeholder="Search donations..."
                      value={donationSearch}
                      onChange={(e) => setDonationSearch(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={downloadDonations}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition"
                    >
                      <span>📥</span>
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {filteredDonations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No donations found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Donor</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600 hidden sm:table-cell">Email</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Amount</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600 hidden md:table-cell">Method</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600 hidden lg:table-cell">Date</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDonations.map((donation, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {donation.fullName || donation.name || 'N/A'}
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              {donation.email || 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium">
                                {donation.currency || 'KES'} {parseFloat(donation.amount || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              {donation.paymentMethod || 'N/A'}
                            </td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              {donation.timestamp ? new Date(donation.timestamp).toLocaleDateString() : 
                               donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleDelete('donation', index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
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
          )}

          {/* File Manager Tab */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-xl font-semibold mb-4">Upload Resources</h2>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleFileUpload}
                    disabled={!uploadFile || uploading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>

                <h3 className="text-lg font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h3>
                {uploadedFiles.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No files uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium truncate flex-1" title={file.originalName}>
                            {file.originalName}
                          </h4>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.originalName)}
                            className="text-red-500 hover:text-red-700 ml-2 transition"
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
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition inline-block"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;