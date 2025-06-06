import React, { useState, useEffect } from 'react';
import { Search, Filter, Bell, Edit, Trash2, Plus, Send, Calendar, Clock, Truck, MapPin, Users, AlertCircle } from 'lucide-react';

// Sample schedule data
const initialScheduleData = [
  {
    id: '1',
    barangay: 'Bombongan',
    street: 'Aralar',
    date: '03/29/2025',
    time: '9:00 am',
    assignedTruck: 'Truck001',
    assignedDriver: 'Kevin Bautista',
    frequency: 'Weekly',
    type: 'Auto',
    status: 'scheduled'
  },
  {
    id: '2',
    barangay: 'Bombongan',
    street: 'Avenue Monique',
    date: '03/30/2025',
    time: '8:00 am',
    assignedTruck: 'Truck001',
    assignedDriver: 'Kevin Bautista',
    frequency: 'Weekly',
    type: 'Auto',
    status: 'scheduled'
  },
  {
    id: '3',
    barangay: 'San Juan',
    street: 'Soriano Street',
    date: '03/31/2025',
    time: '9:00 am',
    assignedTruck: 'Truck002',
    assignedDriver: 'Ryan Mercado',
    frequency: 'Weekly',
    type: 'Auto',
    status: 'scheduled'
  },
  {
    id: '4',
    barangay: 'San Juan',
    street: 'Ramos Boulevard',
    date: '04/01/2025',
    time: '8:00 am',
    assignedTruck: 'Truck002',
    assignedDriver: 'Ryan Mercado',
    frequency: 'Weekly',
    type: 'Auto',
    status: 'scheduled'
  },
  {
    id: '5',
    barangay: 'Bombongan',
    street: 'Biliran Street',
    date: '03/25/2025',
    time: '10:00 am',
    assignedTruck: 'Truck001',
    assignedDriver: 'Kevin Bautista',
    frequency: 'Weekly',
    type: 'Manual',
    status: 'overdue'
  }
];

const CollectionScheduleManagement = () => {
  const [schedules, setSchedules] = useState(initialScheduleData);
  const [filteredSchedules, setFilteredSchedules] = useState(initialScheduleData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    barangay: 'All',
    status: 'All',
    type: 'All',
    frequency: 'All',
    assignedTruck: 'All',
    dateRange: 'All'
  });

  // Get counts and statistics
  const getStats = () => {
    const total = schedules.length;
    const bombonganCount = schedules.filter(s => s.barangay === 'Bombongan').length;
    const sanJuanCount = schedules.filter(s => s.barangay === 'San Juan').length;
    const upcomingCount = schedules.filter(s => s.status === 'scheduled').length;
    const overdueCount = schedules.filter(s => s.status === 'overdue').length;
    
    return { 
      total, 
      bombongan: bombonganCount, 
      sanJuan: sanJuanCount,
      upcoming: upcomingCount,
      overdue: overdueCount
    };
  };

  const stats = getStats();

  // Filter schedules based on active filter, modal filters, and search term
  useEffect(() => {
    let filtered = schedules;

    // Apply barangay filter (modal takes priority over tabs)
    const barangayFilter = filters.barangay !== 'All' ? filters.barangay : activeFilter;
    if (barangayFilter !== 'All') {
      filtered = filtered.filter(schedule => schedule.barangay === barangayFilter);
    }

    // Apply modal filters
    if (filters.status !== 'All') {
      filtered = filtered.filter(schedule => schedule.status === filters.status);
    }
    if (filters.type !== 'All') {
      filtered = filtered.filter(schedule => schedule.type === filters.type);
    }
    if (filters.frequency !== 'All') {
      filtered = filtered.filter(schedule => schedule.frequency === filters.frequency);
    }
    if (filters.assignedTruck !== 'All') {
      filtered = filtered.filter(schedule => schedule.assignedTruck === filters.assignedTruck);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(schedule =>
        schedule.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.assignedTruck.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.date.includes(searchTerm) ||
        schedule.time.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSchedules(filtered);
  }, [schedules, activeFilter, searchTerm, filters]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleNotify = (scheduleId) => {
    console.log('Notify for schedule:', scheduleId);
    // Implement notification functionality
  };

  const handleModify = (scheduleId) => {
    console.log('Modify schedule:', scheduleId);
    // Implement modify functionality
  };

  const handleDelete = (scheduleId) => {
    console.log('Delete schedule:', scheduleId);
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
    }
  };

  const handleCreate = () => {
    console.log('Create new schedule');
    // Implement create functionality
  };

  const handleSendUpdates = () => {
    console.log('Send updates');
    // Implement send updates functionality
  };

  const handleFilterModalOpen = () => {
    setShowFilterModal(true);
  };

  const handleFilterModalClose = () => {
    setShowFilterModal(false);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      barangay: 'All',
      status: 'All',
      type: 'All',
      frequency: 'All',
      assignedTruck: 'All',
      dateRange: 'All'
    });
    setActiveFilter('All');
    setSearchTerm('');
  };

  const getUniqueValues = (field) => {
    const values = [...new Set(schedules.map(schedule => schedule[field]))];
    return values.sort();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Auto' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Collection Schedule Management</h1>
            <p className="text-gray-600">Manage garbage collection schedules across all barangays</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendUpdates}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send Updates</span>
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trucks</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium">
              Schedule List View
            </button>
          </div>
        </div>
        
        {/* Filter and Search Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {[
              { key: 'All', label: `All (${stats.total})` },
              { key: 'Bombongan', label: `Bombongan (${stats.bombongan})` },
              { key: 'San Juan', label: `San Juan (${stats.sanJuan})` }
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
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 lg:w-80 shadow-sm transition-all duration-200"
              />
            </div>
            <button 
              onClick={handleFilterModalOpen}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Barangay</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Street</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ass. Truck</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ass. Driver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Frequency</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchedules.map((schedule, index) => (
                <tr key={schedule.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      schedule.barangay === 'Bombongan' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {schedule.barangay}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{schedule.street}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 font-mono">{schedule.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{schedule.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{schedule.assignedTruck}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">{schedule.assignedDriver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{schedule.frequency}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(schedule.type)}`}>
                      {schedule.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleNotify(schedule.id)}
                        className="px-3 py-1.5 text-sm bg-blue-50 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium"
                      >
                        Notify
                      </button>
                      <button
                        onClick={() => handleModify(schedule.id)}
                        className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 font-medium"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
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
        {filteredSchedules.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No schedules found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Results Info */}
      {filteredSchedules.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredSchedules.length} of {schedules.length} schedules
          {searchTerm && ` matching "${searchTerm}"`}
          {activeFilter !== 'All' && ` in ${activeFilter}`}
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Advanced Filter</h2>
              <button
                onClick={handleFilterModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Barangay Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
                  <select
                    value={filters.barangay}
                    onChange={(e) => handleFilterChange('barangay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="All">All Barangays</option>
                    {getUniqueValues('barangay').map(barangay => (
                      <option key={barangay} value={barangay}>{barangay}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="All">All Types</option>
                    <option value="Auto">Auto</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                {/* Frequency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={filters.frequency}
                    onChange={(e) => handleFilterChange('frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="All">All Frequencies</option>
                    {getUniqueValues('frequency').map(frequency => (
                      <option key={frequency} value={frequency}>{frequency}</option>
                    ))}
                  </select>
                </div>

                {/* Assigned Truck Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Truck</label>
                  <select
                    value={filters.assignedTruck}
                    onChange={(e) => handleFilterChange('assignedTruck', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="All">All Trucks</option>
                    {getUniqueValues('assignedTruck').map(truck => (
                      <option key={truck} value={truck}>{truck}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {Object.values(filters).some(filter => filter !== 'All') && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Active Filters:</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (value !== 'All') {
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                          >
                            {key}: {value}
                            <button
                              onClick={() => handleFilterChange(key, 'All')}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleFilterModalClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFilterModalClose}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionScheduleManagement;