import React, { useState, useEffect } from 'react';
import axios from 'axios';

// -----------------
// Base API URL
// -----------------
const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState('cards');

  // FIXED: Use environment variable with fallback
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'Alfaromeo001@';

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
      console.log('Checking live site health...');
      
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
      alert('Incorrect password');
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
      console.error('Error fetching volunteers:', err);
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
      console.error('Error fetching partners:', err);
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
      console.error('Error fetching donations:', err);
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

  // Mobile card components
  const VolunteerCard = ({ volunteer, index }: { volunteer: any; index: number }) => (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Name</label>
          <input
            type="text"
            value={volunteer.fullName || ''}
            onChange={(e) => handleEditChange('volunteer', index, 'fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Email</label>
          <input
            type="email"
            value={volunteer.email || ''}
            onChange={(e) => handleEditChange('volunteer', index, 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Phone</label>
          <input
            type="text"
            value={volunteer.phone || ''}
            onChange={(e) => handleEditChange('volunteer', index, 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Interest</label>
          <input
            type="text"
            value={volunteer.interest || ''}
            onChange={(e) => handleEditChange('volunteer', index, 'interest', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => handleSave('volunteer', index)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Save
          </button>
          <button
            onClick={() => handleDelete('volunteer', index)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const PartnerCard = ({ partner, index }: { partner: any; index: number }) => (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Organization</label>
          <input
            type="text"
            value={partner.organization || ''}
            onChange={(e) => handleEditChange('partner', index, 'organization', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Contact Person</label>
          <input
            type="text"
            value={partner.contactPerson || ''}
            onChange={(e) => handleEditChange('partner', index, 'contactPerson', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Email</label>
          <input
            type="email"
            value={partner.email || ''}
            onChange={(e) => handleEditChange('partner', index, 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Type</label>
          <input
            type="text"
            value={partner.partnershipType || ''}
            onChange={(e) => handleEditChange('partner', index, 'partnershipType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => handleSave('partner', index)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Save
          </button>
          <button
            onClick={() => handleDelete('partner', index)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const DonationCard = ({ donation, index }: { donation: any; index: number }) => (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-900">{donation.fullName || donation.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{donation.email || 'No email'}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
            {donation.currency || 'KES'} {parseFloat(donation.amount || 0).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Method:</span>
            <p className="font-medium">{donation.paymentMethod || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <p className="font-medium">
              {donation.timestamp ? new Date(donation.timestamp).toLocaleDateString() : 
               donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleDelete('donation', index)}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          Delete Donation
        </button>
      </div>
    </div>
  );

  // -----------------
  // Login View
  // -----------------
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin
              </h1>
              <p className="text-gray-600 mt-3 text-lg">Enter your password to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 mt-1">Smart Education Kenya</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          {[
            { id: 'overview', name: 'Overview', icon: '' },
            { id: 'volunteers', name: 'Volunteers', icon: '' },
            { id: 'partners', name: 'Partners', icon: '' },
            { id: 'donations', name: 'Donations', icon: '' },
            { id: 'files', name: 'File Manager', icon: '' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl mb-3 transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <span className="font-semibold">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-6 py-3 text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-6">
          {/* Loading Indicator */}
          {loading && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-8 shadow-2xl flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 font-semibold">Loading data...</span>
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Volunteers</p>
                      <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Partners</p>
                      <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Donations</p>
                      <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Raised</p>
                      <p className="text-2xl font-bold text-green-600">Ksh {totalDonations.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Status */}
              {healthStatus && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">System Health</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      healthStatus.collections?.status === 'healthy' ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Database</span>
                        <span className={`w-4 h-4 rounded-full ${
                          healthStatus.collections?.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}></span>
                      </div>
                    </div>
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      healthStatus.volunteers?.status === 'healthy' ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Volunteers API</span>
                        <span className={`w-4 h-4 rounded-full ${
                          healthStatus.volunteers?.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}></span>
                      </div>
                    </div>
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      healthStatus.partners?.status === 'healthy' ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Partners API</span>
                        <span className={`w-4 h-4 rounded-full ${
                          healthStatus.partners?.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
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
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Volunteers</h2>
                    <p className="text-gray-600 mt-1">{filteredVolunteers.length} volunteers found</p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Mobile View Toggle */}
                    <div className="flex bg-gray-100 rounded-2xl p-1">
                      <button
                        onClick={() => setMobileView('cards')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mobileView === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Cards
                      </button>
                      <button
                        onClick={() => setMobileView('table')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mobileView === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Table
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Search volunteers..."
                      value={volunteerSearch}
                      onChange={(e) => setVolunteerSearch(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    />
                    <button
                      onClick={downloadVolunteers}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Cards View */}
                {mobileView === 'cards' && (
                  <div className="lg:hidden space-y-4">
                    {filteredVolunteers.map((volunteer, index) => (
                      <VolunteerCard key={index} volunteer={volunteer} index={index} />
                    ))}
                  </div>
                )}

                {/* Table View */}
                <div className={`${mobileView === 'cards' ? 'hidden lg:block' : 'block'}`}>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                          <th className="py-4 px-6 text-left font-semibold text-gray-700">Name</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700">Email</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700 hidden sm:table-cell">Phone</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700 hidden md:table-cell">Interest</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVolunteers.map((volunteer, index) => (
                          <tr key={index} className="border-b hover:bg-blue-50/50 transition">
                            <td className="py-4 px-6">
                              <input
                                type="text"
                                value={volunteer.fullName || ''}
                                onChange={(e) => handleEditChange('volunteer', index, 'fullName', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <input
                                type="email"
                                value={volunteer.email || ''}
                                onChange={(e) => handleEditChange('volunteer', index, 'email', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6 hidden sm:table-cell">
                              <input
                                type="text"
                                value={volunteer.phone || ''}
                                onChange={(e) => handleEditChange('volunteer', index, 'phone', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6 hidden md:table-cell">
                              <input
                                type="text"
                                value={volunteer.interest || ''}
                                onChange={(e) => handleEditChange('volunteer', index, 'interest', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSave('volunteer', index)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleDelete('volunteer', index)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm"
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
              </div>

              {/* Add Volunteer Form */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Volunteer</h3>
                <form onSubmit={handleAddVolunteer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newVolunteer.fullName}
                      onChange={(e) => setNewVolunteer({...newVolunteer, fullName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newVolunteer.email}
                      onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newVolunteer.phone}
                      onChange={(e) => setNewVolunteer({...newVolunteer, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Interest"
                      value={newVolunteer.interest}
                      onChange={(e) => setNewVolunteer({...newVolunteer, interest: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    />
                    <textarea
                      placeholder="Message"
                      value={newVolunteer.message}
                      onChange={(e) => setNewVolunteer({...newVolunteer, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition md:col-span-2"
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold md:col-span-2">
                    Add Volunteer
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Partners</h2>
                    <p className="text-gray-600 mt-1">{filteredPartners.length} partners found</p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Mobile View Toggle */}
                    <div className="flex bg-gray-100 rounded-2xl p-1">
                      <button
                        onClick={() => setMobileView('cards')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mobileView === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Cards
                      </button>
                      <button
                        onClick={() => setMobileView('table')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mobileView === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Table
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Search partners..."
                      value={partnerSearch}
                      onChange={(e) => setPartnerSearch(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    />
                    <button
                      onClick={downloadPartners}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Cards View */}
                {mobileView === 'cards' && (
                  <div className="lg:hidden space-y-4">
                    {filteredPartners.map((partner, index) => (
                      <PartnerCard key={index} partner={partner} index={index} />
                    ))}
                  </div>
                )}

                {/* Table View */}
                <div className={`${mobileView === 'cards' ? 'hidden lg:block' : 'block'}`}>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                          <th className="py-4 px-6 text-left font-semibold text-gray-700">Organization</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700 hidden md:table-cell">Contact</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700">Email</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700 hidden lg:table-cell">Type</th>
                          <th className="py-4 px-6 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPartners.map((partner, index) => (
                          <tr key={index} className="border-b hover:bg-blue-50/50 transition">
                            <td className="py-4 px-6">
                              <input
                                type="text"
                                value={partner.organization || ''}
                                onChange={(e) => handleEditChange('partner', index, 'organization', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6 hidden md:table-cell">
                              <input
                                type="text"
                                value={partner.contactPerson || ''}
                                onChange={(e) => handleEditChange('partner', index, 'contactPerson', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <input
                                type="email"
                                value={partner.email || ''}
                                onChange={(e) => handleEditChange('partner', index, 'email', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6 hidden lg:table-cell">
                              <input
                                type="text"
                                value={partner.partnershipType || ''}
                                onChange={(e) => handleEditChange('partner', index, 'partnershipType', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSave('partner', index)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleDelete('partner', index)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm"
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
              </div>

              {/* Add Partner Form */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Partner</h3>
                <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Organization"
                      value={newPartner.organization}
                      onChange={(e) => setNewPartner({...newPartner, organization: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Contact Person"
                      value={newPartner.contactPerson}
                      onChange={(e) => setNewPartner({...newPartner, contactPerson: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newPartner.email}
                      onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newPartner.phone}
                      onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Partnership Type"
                      value={newPartner.partnershipType}
                      onChange={(e) => setNewPartner({...newPartner, partnershipType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    />
                    <textarea
                      placeholder="Message"
                      value={newPartner.message}
                      onChange={(e) => setNewPartner({...newPartner, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition md:col-span-2"
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold md:col-span-2">
                    Add Partner
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Donations</h2>
                    <p className="text-gray-600 mt-1">
                      Total: <span className="font-bold text-green-600">Ksh {totalDonations.toLocaleString()}</span> • {filteredDonations.length} donations
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Mobile View Toggle */}
                    <div className="flex bg-gray-100 rounded-2xl p-1">
                      <button
                        onClick={() => setMobileView('cards')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mobileView === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Cards
                      </button>
                      <button
                        onClick={() => setMobileView('table')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mobileView === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Table
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Search donations..."
                      value={donationSearch}
                      onChange={(e) => setDonationSearch(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    />
                    <button
                      onClick={downloadDonations}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Export CSV</span>
                    </button>
                  </div>
                </div>

                {filteredDonations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No donations found.</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Cards View */}
                    {mobileView === 'cards' && (
                      <div className="lg:hidden space-y-4">
                        {filteredDonations.map((donation, index) => (
                          <DonationCard key={index} donation={donation} index={index} />
                        ))}
                      </div>
                    )}

                    {/* Table View */}
                    <div className={`${mobileView === 'cards' ? 'hidden lg:block' : 'block'}`}>
                      <div className="overflow-x-auto rounded-2xl border border-gray-200">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                              <th className="py-4 px-6 text-left font-semibold text-gray-700">Donor</th>
                              <th className="py-4 px-6 text-left font-semibold text-gray-700 hidden sm:table-cell">Email</th>
                              <th className="py-4 px-6 text-left font-semibold text-gray-700">Amount</th>
                              <th className="py-4 px-6 text-left font-semibold text-gray-700 hidden md:table-cell">Method</th>
                              <th className="py-4 px-6 text-left font-semibold text-gray-700 hidden lg:table-cell">Date</th>
                              <th className="py-4 px-6 text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDonations.map((donation, index) => (
                              <tr key={index} className="border-b hover:bg-blue-50/50 transition">
                                <td className="py-4 px-6">
                                  <div>
                                    <p className="font-semibold text-gray-900">{donation.fullName || donation.name || 'Anonymous'}</p>
                                    <p className="text-sm text-gray-500 sm:hidden">{donation.email || 'No email'}</p>
                                  </div>
                                </td>
                                <td className="py-4 px-6 hidden sm:table-cell">
                                  {donation.email || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                                    {donation.currency || 'KES'} {parseFloat(donation.amount || 0).toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-4 px-6 hidden md:table-cell">
                                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                                    {donation.paymentMethod || 'N/A'}
                                  </span>
                                </td>
                                <td className="py-4 px-6 hidden lg:table-cell">
                                  <span className="text-sm text-gray-600">
                                    {donation.timestamp ? new Date(donation.timestamp).toLocaleDateString() : 
                                     donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <button
                                    onClick={() => handleDelete('donation', index)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* File Manager Tab */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">File Manager</h2>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="flex-1 px-4 py-3 border-2 border-dashed border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition hover:border-blue-300"
                  />
                  <button
                    onClick={handleFileUpload}
                    disabled={!uploadFile || uploading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold disabled:transform-none"
                  >
                    {uploading ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </span>
                    ) : (
                      'Upload File'
                    )}
                  </button>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Files ({uploadedFiles.length})</h3>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No files uploaded yet.</p>
                    <p className="text-gray-400 mt-2">Upload your first file to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border-2 border-gray-100 rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-200 hover:border-blue-200">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-gray-800 truncate flex-1" title={file.originalName}>
                            {file.originalName}
                          </h4>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.originalName)}
                            className="text-red-500 hover:text-red-700 ml-3 transition p-2 hover:bg-red-50 rounded-xl"
                            title="Delete file"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">
                            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                          <a
                            href={`${API_URL}${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-center py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                          >
                            Download
                          </a>
                        </div>
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;