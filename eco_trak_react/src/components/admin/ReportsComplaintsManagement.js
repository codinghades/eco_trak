import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Eye, CheckCircle, X, FileText, Clock, User, MapPin, AlertTriangle, ChevronDown } from 'lucide-react';

// Sample complaints data (Updated: 'In Progress' changed to 'Pending')
const initialComplaintsData = [
  {
    id: '001',
    residentName: 'Joshua Ramirez',
    barangay: 'Bombongan',
    street: 'Aralar Street',
    type: 'Missed Pickup',
    status: 'Pending',
    contactNo: '09464176137',
    dateReported: '2025-03-22 08:30', // YYYY-MM-DD HH:MM
    description: 'The garbage truck did not come to our street today, March 22, 2025, even though it was scheduled for pickup. Our garbage bins are full, and we need them collected as soon as possible. Please reschedule the pickup.',
    attachments: ['Photo']
  },
  {
    id: '002',
    residentName: 'Erica Villanueva',
    barangay: 'Bombongan',
    street: 'Avenue Monique',
    type: 'Damaged Bin',
    status: 'Pending',
    contactNo: '09876543210',
    dateReported: '2025-03-23 14:15',
    description: 'Our garbage bin was damaged during collection. The lid is broken and the side has a large crack. We need a replacement bin as soon as possible.',
    attachments: ['Photo', 'Video']
  },
  {
    id: '003',
    residentName: 'Maria Santos',
    barangay: 'San Juan',
    street: 'Rizal Avenue',
    type: 'Late Collection',
    status: 'Resolved',
    contactNo: '09123456789',
    dateReported: '2025-03-20 10:20',
    description: 'Collection was 3 hours late from the scheduled time. This has been happening frequently in our area.',
    attachments: []
  },
  {
    id: '004',
    residentName: 'Pedro Garcia',
    barangay: 'San Juan',
    street: 'Del Pilar Street',
    type: 'Overflowing Bin',
    status: 'Pending', // Changed from 'In Progress'
    contactNo: '09987654321',
    dateReported: '2025-03-24 16:45',
    description: 'The communal bin in our area is overflowing and creating unsanitary conditions. Needs immediate attention.',
    attachments: ['Photo']
  }
];

const ComplaintFilterModal = ({ isOpen, onClose, filters, onApplyFilters, complaintsData }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: { startDate: '', endDate: '' },
      barangay: '',
      complaintType: ''
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  const uniqueBarangays = [...new Set(complaintsData.map(c => c.barangay))].sort();
  const uniqueComplaintTypes = [...new Set(complaintsData.map(c => c.type))].sort();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="filterModalTitle">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 id="filterModalTitle" className="text-lg font-semibold text-gray-900">Filter Complaints</h3>
          <button
            onClick={onClose}
            aria-label="Close filter modal"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Reported Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                aria-label="Start date for reported complaints"
                value={localFilters.dateRange.startDate}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  dateRange: { ...localFilters.dateRange, startDate: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                aria-label="End date for reported complaints"
                value={localFilters.dateRange.endDate}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  dateRange: { ...localFilters.dateRange, endDate: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Barangay Filter */}
          <div>
            <label htmlFor="barangayFilterModal" className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
            <select
              id="barangayFilterModal"
              value={localFilters.barangay}
              onChange={(e) => setLocalFilters({ ...localFilters, barangay: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">All Barangays</option>
              {uniqueBarangays.map(barangay => (
                <option key={barangay} value={barangay}>{barangay}</option>
              ))}
            </select>
          </div>

          {/* Complaint Type Filter */}
          <div>
            <label htmlFor="complaintTypeFilterModal" className="block text-sm font-medium text-gray-700 mb-2">Complaint Type</label>
            <select
              id="complaintTypeFilterModal"
              value={localFilters.complaintType}
              onChange={(e) => setLocalFilters({ ...localFilters, complaintType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">All Types</option>
              {uniqueComplaintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};


const ReportsComplaintsManagement = () => {
  const [complaints, setComplaints] = useState(initialComplaintsData);
  const [filteredComplaints, setFilteredComplaints] = useState(initialComplaintsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { startDate: '', endDate: '' },
    barangay: '',
    complaintType: ''
  });

  const getStats = useCallback(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    return { total, pending, resolved };
  }, [complaints]);

  const stats = getStats();

  useEffect(() => {
    let tempFiltered = [...complaints];

    // Apply status filter
    if (statusFilter !== 'All') {
      tempFiltered = tempFiltered.filter(complaint => complaint.status === statusFilter);
    }

    // Apply advanced filters
    if (advancedFilters.dateRange.startDate) {
        tempFiltered = tempFiltered.filter(complaint => {
            const complaintDate = complaint.dateReported.split(' ')[0]; // Get YYYY-MM-DD part
            return complaintDate >= advancedFilters.dateRange.startDate;
        });
    }
    if (advancedFilters.dateRange.endDate) {
        tempFiltered = tempFiltered.filter(complaint => {
            const complaintDate = complaint.dateReported.split(' ')[0]; // Get YYYY-MM-DD part
            return complaintDate <= advancedFilters.dateRange.endDate;
        });
    }
    if (advancedFilters.barangay) {
      tempFiltered = tempFiltered.filter(complaint => complaint.barangay === advancedFilters.barangay);
    }
    if (advancedFilters.complaintType) {
      tempFiltered = tempFiltered.filter(complaint => complaint.type === advancedFilters.complaintType);
    }

    // Apply search filter
    if (searchTerm) {
      tempFiltered = tempFiltered.filter(complaint =>
        complaint.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.includes(searchTerm)
      );
    }

    setFilteredComplaints(tempFiltered);
  }, [complaints, statusFilter, searchTerm, advancedFilters]);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedComplaint(null);
  };

  const handleResolve = (complaintId) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, status: 'Resolved' }
          : complaint
      )
    );
    // If details view is open for this complaint, update it as well
    if (selectedComplaint && selectedComplaint.id === complaintId) {
        setSelectedComplaint(prev => ({...prev, status: 'Resolved'}));
    }
  };

  const handleDismiss = (complaintId) => {
    if (window.confirm('Are you sure you want to dismiss this complaint?')) {
      setComplaints(prevComplaints => prevComplaints.filter(complaint => complaint.id !== complaintId));
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        handleBackToList(); // Go back to list if current detailed view is dismissed
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Missed Pickup':
        return 'bg-red-100 text-red-800';
      case 'Damaged Bin':
        return 'bg-orange-100 text-orange-800';
      case 'Late Collection':
        return 'bg-purple-100 text-purple-800';
      case 'Overflowing Bin':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  
  const handleApplyAdvancedFilters = (newFilters) => {
    setAdvancedFilters(newFilters);
  };

  const hasActiveAdvancedFilters = () => {
    return advancedFilters.dateRange.startDate || 
           advancedFilters.dateRange.endDate || 
           advancedFilters.barangay || 
           advancedFilters.complaintType;
  };

  if (showDetails && selectedComplaint) {
    return <ComplaintDetails complaint={selectedComplaint} onBack={handleBackToList} onResolve={handleResolve} onDismiss={handleDismiss} />;
  }

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Complaints Management</h1>
            <p className="text-gray-600">Manage and respond to resident reports and complaints</p>
          </div>
        </div>

        {/* Stats Cards - Updated to 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search complaints by name, barangay, street, type, or ID"
              className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 lg:w-80 shadow-sm transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter complaints by status"
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button
              onClick={handleOpenFilterModal}
              aria-label="Open advanced filters"
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 shadow-sm ${
                hasActiveAdvancedFilters() 
                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveAdvancedFilters() && (
                <span className="w-2 h-2 bg-green-500 rounded-full ml-1" aria-hidden="true"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Complaint ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resident Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Barangay</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Street</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComplaints.map((complaint, index) => (
                <tr key={complaint.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-gray-900">{complaint.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{complaint.residentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      complaint.barangay === 'Bombongan' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800' // Example, can be dynamic
                    }`}>
                      {complaint.barangay}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{complaint.street}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(complaint.type)}`}>
                      {complaint.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetails(complaint)}
                        aria-label={`View details for complaint ${complaint.id}`}
                        className="px-3 py-1.5 text-sm bg-blue-50 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium"
                      >
                        View details
                      </button>
                      {complaint.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolve(complaint.id)}
                          aria-label={`Mark complaint ${complaint.id} as resolved`}
                          className="px-3 py-1.5 text-sm bg-green-50 border border-green-200 rounded-md text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200 font-medium"
                        >
                          Resolve
                        </button>
                      )}
                       <button
                        onClick={() => handleDismiss(complaint.id)}
                        aria-label={`Dismiss complaint ${complaint.id}`}
                        className="px-3 py-1.5 text-sm bg-red-50 border border-red-200 rounded-md text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-medium"
                      >
                        Dismiss
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No complaints found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {filteredComplaints.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredComplaints.length} of {complaints.length} complaints
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'All' && ` with status "${statusFilter}"`}
          {hasActiveAdvancedFilters() && ' (with advanced filters applied)'}
        </div>
      )}
      <ComplaintFilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        filters={advancedFilters}
        onApplyFilters={handleApplyAdvancedFilters}
        complaintsData={complaints} 
      />
    </div>
  );
};

// Complaint Details Component (Minor updates for consistency if any, mostly for resolve/dismiss logic)
const ComplaintDetails = ({ complaint, onBack, onResolve, onDismiss }) => {
  const [emailContent, setEmailContent] = useState('');

  useEffect(() => {
    if (complaint) {
      setEmailContent(`Dear ${complaint.residentName},

We are writing in response to your report regarding "${complaint.type}" (ID: ${complaint.id}) dated ${complaint.dateReported.split(' ')[0]}.

[Please add details of the action taken or current status here.]

Thank you for helping us improve our services.

Best regards,
EcoTrak Team`);
    }
  }, [complaint]);


  const handleSendEmail = () => {
    if(!complaint) return;
    console.log(`Sending email for complaint ${complaint.id}:`, emailContent);
    alert('Email sent successfully! (Simulated)');
  };

  const handleNotifyResident = () => {
    if(!complaint) return;
    console.log('Notifying resident for complaint:', complaint.id);
    alert(`Resident associated with complaint ${complaint.id} has been notified! (Simulated)`);
  };
  
  const getStatusColorInDetails = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  if (!complaint) return null; // Should not happen if showDetails is true

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Complaint Details</h1>
        <button
          onClick={onBack}
          aria-label="Back to complaints list"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
        >
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Complaint ID:</p>
            <p className="text-lg font-semibold text-gray-900">{complaint.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Barangay:</p>
            <p className="text-lg text-gray-800">{complaint.barangay}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Status:</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColorInDetails(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Resident Name:</p>
            <p className="text-lg text-gray-800">{complaint.residentName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Complaint:</p>
            <p className="text-lg text-gray-800">{complaint.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Contact no:</p>
            <p className="text-lg text-gray-800 font-mono">{complaint.contactNo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Date Reported:</p>
            <p className="text-lg text-gray-800">{complaint.dateReported}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-1">Description:</p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800 leading-relaxed italic">"{complaint.description}"</p>
          </div>
        </div>

        {complaint.attachments && complaint.attachments.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Attachments:</p>
            <div className="flex flex-wrap gap-2">
              {complaint.attachments.map((attachment, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                  <FileText size={14} className="mr-1.5" />
                  {attachment}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
          {complaint.status !== 'Resolved' && (
             <button
                onClick={() => onResolve(complaint.id)}
                aria-label="Mark this complaint as resolved"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle size={16}/> Resolve
              </button>
          )}
          <button
            onClick={() => onDismiss(complaint.id)}
            aria-label="Dismiss this complaint"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          >
           <X size={16}/> Dismiss
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Communicate with Resident</h2>
        
        <div className="mb-6">
          <label htmlFor="emailContent" className="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
          <textarea
            id="emailContent"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-gray-50"
            placeholder="Compose an email to the resident..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleNotifyResident}
            aria-label="Notify resident via other means"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <User className="w-4 h-4" />
            Notify Resident (Other)
          </button>
          <button
            onClick={handleSendEmail}
            aria-label="Send email to resident"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsComplaintsManagement;