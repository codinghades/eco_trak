import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Plus, Printer, UserPlus, X, ChevronDown } from 'lucide-react';

// Enhanced sample data with house numbers
const initialUsersData = [
  {
    id: '250149',
    name: 'Joshua Ramirez',
    age: 21,
    contact: '09464176137',
    barangay: 'Bombongan',
    houseNumber: '123',
    street: 'Aralar Street'
  },
  {
    id: '936445',
    name: 'Erica Villanueva',
    age: 35,
    contact: '09927157804',
    barangay: 'Bombongan',
    houseNumber: '456',
    street: 'Biliran Street'
  },
  {
    id: '387944',
    name: 'Daniel Cruz',
    age: 43,
    contact: '09432315364',
    barangay: 'San Juan',
    houseNumber: '789',
    street: 'Soriano Street'
  },
  {
    id: '838547',
    name: 'Sophia Mendoza',
    age: 32,
    contact: '09897668943',
    barangay: 'San Juan',
    houseNumber: '101',
    street: 'Ramos Boulevard'
  },
  {
    id: '729183',
    name: 'Miguel Torres',
    age: 28,
    contact: '09123456789',
    barangay: 'Bombongan',
    houseNumber: '202',
    street: 'Avenue Monique'
  },
  {
    id: '591074',
    name: 'Carmen Lopez',
    age: 41,
    contact: '09876543210',
    barangay: 'San Juan',
    houseNumber: '303',
    street: 'Ramos Boulevard'
  }
];

const FilterModal = ({ isOpen, onClose, filters, onApplyFilters, users }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      ageRange: { min: '', max: '' },
      barangay: '',
      street: ''
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  const uniqueStreets = [...new Set(users.map(user => user.street))].sort();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-128 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Age Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.ageRange.min}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  ageRange: { ...localFilters.ageRange, min: e.target.value }
                })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.ageRange.max}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  ageRange: { ...localFilters.ageRange, max: e.target.value }
                })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Barangay Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
            <select
              value={localFilters.barangay}
              onChange={(e) => setLocalFilters({ ...localFilters, barangay: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Barangays</option>
              <option value="Bombongan">Bombongan</option>
              <option value="San Juan">San Juan</option>
            </select>
          </div>

          {/* Street Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
            <select
              value={localFilters.street}
              onChange={(e) => setLocalFilters({ ...localFilters, street: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Streets</option>
              {uniqueStreets.map(street => (
                <option key={street} value={street}>{street}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const BarangayUsersView = () => {
  const [users, setUsers] = useState(initialUsersData);
  const [filteredUsers, setFilteredUsers] = useState(initialUsersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    ageRange: { min: '', max: '' },
    barangay: '',
    street: ''
  });

  // Get counts for each barangay
  const getCounts = () => {
    const bombonganCount = users.filter(u => u.barangay === 'Bombongan').length;
    const sanJuanCount = users.filter(u => u.barangay === 'San Juan').length;
    return { bombongan: bombonganCount, sanJuan: sanJuanCount, total: users.length };
  };

  const counts = getCounts();

  // Filter users based on all filters
  useEffect(() => {
    let filtered = users;

    // Apply barangay filter from tabs
    if (activeFilter !== 'All') {
      filtered = filtered.filter(user => user.barangay === activeFilter);
    }

    // Apply advanced filters
    if (advancedFilters.ageRange.min) {
      filtered = filtered.filter(user => user.age >= parseInt(advancedFilters.ageRange.min));
    }
    if (advancedFilters.ageRange.max) {
      filtered = filtered.filter(user => user.age <= parseInt(advancedFilters.ageRange.max));
    }
    if (advancedFilters.barangay) {
      filtered = filtered.filter(user => user.barangay === advancedFilters.barangay);
    }
    if (advancedFilters.street) {
      filtered = filtered.filter(user => user.street === advancedFilters.street);
    }

    // Apply search filter (now includes house number)
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.includes(searchTerm) ||
        user.contact.includes(searchTerm) ||
        user.houseNumber.includes(searchTerm) ||
        user.street.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, activeFilter, searchTerm, advancedFilters]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleModify = (userId) => {
    console.log('Modify user:', userId);
    // Implement modify functionality
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
    // Implement delete functionality
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleExport = () => {
    console.log('Export users data'); 
    // Implement export functionality
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
  };

  const hasActiveAdvancedFilters = () => {
    return advancedFilters.ageRange.min || 
           advancedFilters.ageRange.max || 
           advancedFilters.barangay || 
           advancedFilters.street;
  };

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Barangay Users Management</h1>
            <p className="text-gray-600">Manage residents across all barangays</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bombongan</p>
                <p className="text-2xl font-bold text-gray-900">{counts.bombongan}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">San Juan</p>
                <p className="text-2xl font-bold text-gray-900">{counts.sanJuan}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter and Search Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {[
              { key: 'All', label: `All (${counts.total})` },
              { key: 'Bombongan', label: `Bombongan (${counts.bombongan})` },
              { key: 'San Juan', label: `San Juan (${counts.sanJuan})` }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterClick(filter.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 lg:w-80 shadow-sm transition-all duration-200"
              />
            </div>
            <button 
              onClick={handleOpenFilterModal}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 shadow-sm ${
                hasActiveAdvancedFilters() 
                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveAdvancedFilters() && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resident ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resident Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Barangay</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">House No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Street</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.age}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">{user.contact}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.barangay === 'Bombongan' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.barangay}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.houseNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.street}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleModify(user.id)}
                        className="px-3 py-1.5 text-sm bg-blue-50 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Results Info */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredUsers.length} of {users.length} users
          {searchTerm && ` matching "${searchTerm}"`}
          {activeFilter !== 'All' && ` in ${activeFilter}`}
          {hasActiveAdvancedFilters() && ' (with advanced filters)'}
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={advancedFilters}
        onApplyFilters={handleApplyAdvancedFilters}
        users={users}
      />
    </div>
  );
};

export default BarangayUsersView;