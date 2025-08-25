import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import AddDriverPage from './AddDriverPage';
import { Search, Filter, Edit, Trash2, Plus, Printer, UserPlus, Truck, MapPin, Users, User, X, ChevronDown, AlertCircle } from 'lucide-react';

// Remove fallback data - we don't need it anymore

const FilterModal = ({ isOpen, onClose, onApply, filterCriteria, setFilterCriteria, drivers }) => {
  const [tempCriteria, setTempCriteria] = useState(filterCriteria);

  useEffect(() => {
    setTempCriteria(filterCriteria);
  }, [filterCriteria, isOpen]);

  const handleApply = () => {
    setFilterCriteria(tempCriteria);
    onApply(tempCriteria);
    onClose();
  };

  const handleClear = () => {
    const clearedCriteria = {
      ageMin: '',
      ageMax: '',
      selectedTrucks: [],
      selectedRoutes: []
    };
    setTempCriteria(clearedCriteria);
  };

  const handleReset = () => {
    const resetCriteria = {
      ageMin: '',
      ageMax: '',
      selectedTrucks: [],
      selectedRoutes: []
    };
    setFilterCriteria(resetCriteria);
    onApply(resetCriteria);
    onClose();
  };

  // Get unique trucks and routes for filter options
  const uniqueTrucks = [...new Set(drivers.map(d => d.assignedTruck))].sort();
  const uniqueRoutes = [...new Set(drivers.map(d => d.assignedRoute))].sort();

  const handleTruckToggle = (truck) => {
    setTempCriteria(prev => ({
      ...prev,
      selectedTrucks: prev.selectedTrucks.includes(truck)
        ? prev.selectedTrucks.filter(t => t !== truck)
        : [...prev.selectedTrucks, truck]
    }));
  };

  const handleRouteToggle = (route) => {
    setTempCriteria(prev => ({
      ...prev,
      selectedRoutes: prev.selectedRoutes.includes(route)
        ? prev.selectedRoutes.filter(r => r !== route)
        : [...prev.selectedRoutes, route]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Filter Drivers</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close filter modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="space-y-6">
            {/* Age Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Age Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Age</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={tempCriteria.ageMin}
                    onChange={(e) => setTempCriteria(prev => ({ ...prev, ageMin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Age</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={tempCriteria.ageMax}
                    onChange={(e) => setTempCriteria(prev => ({ ...prev, ageMax: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Truck Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Assigned Trucks</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {uniqueTrucks.map(truck => (
                  <label key={truck} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempCriteria.selectedTrucks.includes(truck)}
                      onChange={() => handleTruckToggle(truck)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{truck}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Route Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Assigned Routes</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueRoutes.map(route => (
                  <label key={route} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempCriteria.selectedRoutes.includes(route)}
                      onChange={() => handleRouteToggle(route)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                    />
                    <span className="text-sm text-gray-700 leading-tight">{route}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <div className="space-x-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TruckDriverView = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    ageMin: '',
    ageMax: '',
    selectedTrucks: [],
    selectedRoutes: []
  });

  // Fetch drivers from Firestore
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const driversRef = collection(db, 'drivers');
      const snapshot = await getDocs(driversRef);
      
      const driversData = snapshot.docs.map(doc => ({
        id: doc.data().id || doc.id, // Use custom ID if available, fallback to document ID
        uid: doc.id, // Store document ID for deletion
        ...doc.data()
      }));

      setDrivers(driversData);
      setError('');
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to load drivers from database.');
      setDrivers([]); // Set empty array instead of fallback data
    } finally {
      setLoading(false);
    }
  };

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Get counts for each barangay
  const getCounts = () => {
    const bombonganCount = drivers.filter(d => d.assignedBarangay === 'Bombongan').length;
    const sanJuanCount = drivers.filter(d => d.assignedBarangay === 'San Juan').length;
    return { bombongan: bombonganCount, sanJuan: sanJuanCount, total: drivers.length };
  };

  const counts = getCounts();

  // Check if any advanced filters are active
  const hasActiveFilters = () => {
    return filterCriteria.ageMin !== '' || 
           filterCriteria.ageMax !== '' || 
           filterCriteria.selectedTrucks.length > 0 || 
           filterCriteria.selectedRoutes.length > 0;
  };

  // Filter drivers based on all criteria
  useEffect(() => {
    let filtered = drivers;

    // Apply barangay filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter(driver => driver.assignedBarangay === activeFilter);
    }

    // Apply advanced filters
    if (filterCriteria.ageMin !== '') {
      filtered = filtered.filter(driver => driver.age >= parseInt(filterCriteria.ageMin));
    }
    if (filterCriteria.ageMax !== '') {
      filtered = filtered.filter(driver => driver.age <= parseInt(filterCriteria.ageMax));
    }
    if (filterCriteria.selectedTrucks.length > 0) {
      filtered = filtered.filter(driver => filterCriteria.selectedTrucks.includes(driver.assignedTruck));
    }
    if (filterCriteria.selectedRoutes.length > 0) {
      filtered = filtered.filter(driver => filterCriteria.selectedRoutes.includes(driver.assignedRoute));
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.id.toString().includes(searchTerm) ||
        driver.contact.includes(searchTerm) ||
        driver.assignedTruck.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.assignedRoute.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDrivers(filtered);
  }, [drivers, activeFilter, searchTerm, filterCriteria]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleModify = (driverId) => {
    console.log('Modify driver:', driverId);
    // Implement modify functionality
  };

  const handleDelete = async (driverId, driverUid) => {
    if (!window.confirm('Are you sure you want to delete this driver? This will permanently remove their account.')) {
      return;
    }

    try {
      // Delete from Firestore using UID (document ID)
      await deleteDoc(doc(db, 'drivers', driverUid));
      
      // Update local state using the display ID
      setDrivers(drivers.filter(driver => driver.id !== driverId));
      
      console.log('Driver deleted successfully');
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver. Please try again.');
    }
  };

  const handleAddDriver = () => {
    setShowAddDriver(true);
  };

  const handleGoBackToDrivers = () => {
    setShowAddDriver(false);
    // Refresh drivers list after adding new driver
    fetchDrivers();
  };

  const handleExport = () => {
    console.log('Export drivers data');
    // Implement export functionality
  };

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleApplyFilters = (criteria) => {
    setFilterCriteria(criteria);
  };

  // Show Add Driver page
  if (showAddDriver) {
    return <AddDriverPage onNavigateBack={handleGoBackToDrivers} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Garbage Truck & Driver Management</h1>
            <p className="text-gray-600">Manage truck drivers and their assigned routes</p>
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
            <button
              onClick={handleAddDriver}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Driver</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
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
                <Truck className="w-6 h-6 text-green-600" />
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
                <MapPin className="w-6 h-6 text-purple-600" />
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
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 lg:w-80 shadow-sm transition-all duration-200"
              />
            </div>
            <button 
              onClick={handleOpenFilterModal}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 shadow-sm ${
                hasActiveFilters() 
                  ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100' 
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters() && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-200 text-green-800 rounded-full">
                  {Object.values(filterCriteria).flat().filter(v => v !== '' && v !== null).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filterCriteria.ageMin && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Min age: {filterCriteria.ageMin}
              </span>
            )}
            {filterCriteria.ageMax && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Max age: {filterCriteria.ageMax}
              </span>
            )}
            {filterCriteria.selectedTrucks.map(truck => (
              <span key={truck} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {truck}
              </span>
            ))}
            {filterCriteria.selectedRoutes.map(route => (
              <span key={route} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs max-w-48 truncate">
                {route}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Driver ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Driver Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned Truck</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Barangay</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDrivers.map((driver, index) => (
                <tr key={driver.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{driver.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{driver.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{driver.age}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">{driver.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{driver.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{driver.assignedTruck}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate" title={driver.assignedRoute}>
                          {driver.assignedRoute}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      driver.assignedBarangay === 'Bombongan' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {driver.assignedBarangay}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleModify(driver.id)}
                        className="px-3 py-1.5 text-sm bg-blue-50 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id, driver.uid)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200"
                        title="Delete Driver"
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
        {filteredDrivers.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            {drivers.length === 0 ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No drivers registered yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first driver</p>
                <button
                  onClick={handleAddDriver}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add First Driver
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No drivers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Results Info */}
      {filteredDrivers.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredDrivers.length} of {drivers.length} drivers
          {searchTerm && ` matching "${searchTerm}"`}
          {activeFilter !== 'All' && ` in ${activeFilter}`}
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
        filterCriteria={filterCriteria}
        setFilterCriteria={setFilterCriteria}
        drivers={drivers}
      />
    </div>
  );
};

export default TruckDriverView;