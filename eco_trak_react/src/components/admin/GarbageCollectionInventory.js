import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter as FilterIcon, Plus, Edit3, Trash2, FileText, MapPin, CalendarDays, Clock, Truck, User, Weight, X , Archive, Printer} from 'lucide-react';

// Sample initial inventory data (Removed "Other Barangay" entry)
const initialInventoryData = [
  {
    id: 'inv1',
    barangay: 'Bombongan',
    street: 'Aralar',
    date: '03/29/2025', // MM/DD/YYYY
    time: '9:00 am',
    assignedTruck: 'Truck001',
    assignedDriver: 'Kevin Bautista',
    weight: '1,800kg',
    status: 'recorded'
  },
  {
    id: 'inv2',
    barangay: 'Bombongan',
    street: 'Avenue Monique',
    date: '03/30/2025',
    time: '8:00 am',
    assignedTruck: 'Truck001',
    assignedDriver: 'Kevin Bautista',
    weight: '1,200kg',
    status: 'recorded'
  },
  {
    id: 'inv3',
    barangay: 'Bombongan',
    street: 'Biliran Street',
    date: '03/30/2025',
    time: '8:00 am',
    assignedTruck: 'Truck001',
    assignedDriver: 'Kevin Bautista',
    weight: '800kg',
    status: 'recorded'
  },
  {
    id: 'inv4',
    barangay: 'San Juan',
    street: 'Catanduanes Street',
    date: '03/30/2025',
    time: '9:30 am',
    assignedTruck: 'Truck002',
    assignedDriver: 'Ryan Mercado',
    weight: '1,000kg',
    status: 'recorded'
  },
   {
    id: 'inv5',
    barangay: 'San Juan',
    street: 'Soriano Street',
    date: '04/01/2025',
    time: '10:00 am',
    assignedTruck: 'Truck002',
    assignedDriver: 'Ryan Mercado',
    weight: '1500kg',
    status: 'recorded'
  }
];

// Sample options for dropdowns (Removed "Other Barangay")
const barangayOptions = ['Bombongan', 'San Juan'];
const streetOptions = {
  Bombongan: ['Aralar', 'Avenue Monique', 'Biliran Street', 'Catanduanes Street'],
  'San Juan': ['Soriano Street', 'Ramos Boulevard', 'Another Street', 'Catanduanes Street'],
  // Removed 'Other Barangay' entry
};
const truckOptions = ['Truck001', 'Truck002', 'Truck003'];
const driverOptions = ['Kevin Bautista', 'Ryan Mercado', 'Ana Gomez'];

const initialAdvancedFiltersState = {
  dateRange: { startDate: '', endDate: '' },
  barangay: '',
  street: '',
  assignedTruck: '',
  assignedDriver: '',
  weightRange: { min: '', max: '' }
};

const InventoryFilterModal = ({ isOpen, onClose, filters, onApplyFilters }) => { // Removed allInventoryData prop as it's not directly used for options here
  const [localFilters, setLocalFilters] = useState(initialAdvancedFiltersState);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRangeInputChange = (e, rangeType, field) => {
    const { value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [rangeType]: {
        ...prev[rangeType],
        [field]: value
      }
    }));
  };
  
  const handleBarangayChange = (e) => {
    const { value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      barangay: value,
      street: '' // Reset street when barangay changes
    }));
  };

  const availableStreets = localFilters.barangay ? (streetOptions[localFilters.barangay] || []) : [];


  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(initialAdvancedFiltersState);
    onApplyFilters(initialAdvancedFiltersState);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="inventoryFilterModalTitle">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 id="inventoryFilterModalTitle" className="text-lg font-semibold text-gray-900">Filter Inventory Records</h3>
          <button onClick={onClose} aria-label="Close filter modal" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Collection Date Range</label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                aria-label="Start date for collection"
                value={localFilters.dateRange.startDate}
                onChange={(e) => handleRangeInputChange(e, 'dateRange', 'startDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="date"
                aria-label="End date for collection"
                value={localFilters.dateRange.endDate}
                onChange={(e) => handleRangeInputChange(e, 'dateRange', 'endDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modalBarangayFilter" className="block text-sm font-medium text-gray-700 mb-1.5">Barangay</label>
            <select
              id="modalBarangayFilter"
              name="barangay"
              value={localFilters.barangay}
              onChange={handleBarangayChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
            >
              <option value="">All Barangays</option>
              {barangayOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="modalStreetFilter" className="block text-sm font-medium text-gray-700 mb-1.5">Street</label>
            <select
              id="modalStreetFilter"
              name="street"
              value={localFilters.street}
              onChange={handleInputChange}
              disabled={!localFilters.barangay || availableStreets.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm disabled:bg-gray-100"
            >
              <option value="">All Streets</option>
              {availableStreets.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label htmlFor="modalTruckFilter" className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Truck</label>
            <select
              id="modalTruckFilter"
              name="assignedTruck"
              value={localFilters.assignedTruck}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
            >
              <option value="">All Trucks</option>
              {truckOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="modalDriverFilter" className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Driver</label>
            <select
              id="modalDriverFilter"
              name="assignedDriver"
              value={localFilters.assignedDriver}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
            >
              <option value="">All Drivers</option>
              {driverOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight Range (kg)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min kg"
                aria-label="Minimum weight in kg"
                value={localFilters.weightRange.min}
                onChange={(e) => handleRangeInputChange(e, 'weightRange', 'min')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="number"
                placeholder="Max kg"
                aria-label="Maximum weight in kg"
                value={localFilters.weightRange.max}
                onChange={(e) => handleRangeInputChange(e, 'weightRange', 'max')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
          <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            Reset
          </button>
          <button onClick={handleApply} className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};


const GarbageCollectionInventory = () => {
  const [inventory, setInventory] = useState(initialInventoryData);
  const [filteredInventory, setFilteredInventory] = useState(initialInventoryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBarangayFilter, setActiveBarangayFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [isInventoryFilterModalOpen, setIsInventoryFilterModalOpen] = useState(false);
  const [advancedInventoryFilters, setAdvancedInventoryFilters] = useState(initialAdvancedFiltersState);


  const initialFormState = {
    barangay: barangayOptions.length > 0 ? barangayOptions[0] : '', // Handle empty barangayOptions
    street: barangayOptions.length > 0 && streetOptions[barangayOptions[0]]?.length > 0 ? streetOptions[barangayOptions[0]][0] : '', // Handle empty streetOptions
    scheduleDate: new Date().toISOString().split('T')[0],
    scheduleTime: '09:00',
    assignedTruck: truckOptions.length > 0 ? truckOptions[0] : '',
    assignedDriver: driverOptions.length > 0 ? driverOptions[0] : '',
    weight: '',
  };
  const [newInventoryItem, setNewInventoryItem] = useState(initialFormState);

  const getBarangayCounts = useCallback(() => {
    const counts = { All: initialInventoryData.length }; 
    barangayOptions.forEach(b => { // Iterates over updated barangayOptions
      counts[b] = initialInventoryData.filter(item => item.barangay === b).length;
    });
    return counts;
  }, []); 

  const barangayCounts = getBarangayCounts();

  const parseWeight = (weightString) => {
    if (!weightString) return 0;
    return parseFloat(String(weightString).replace(/kg|,/gi, ''));
  };

  const formatDateForComparison = (dateStringMMDDYYYY) => {
    const parts = dateStringMMDDYYYY.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
    return null;
  };

  useEffect(() => {
    let tempFiltered = [...inventory]; // Start with full original inventory for filtering

    // Apply active Barangay Tab Filter first
    if (activeBarangayFilter !== 'All') {
      tempFiltered = tempFiltered.filter(item => item.barangay === activeBarangayFilter);
    }
    
    const { dateRange, barangay, street, assignedTruck, assignedDriver, weightRange } = advancedInventoryFilters;

    if (dateRange.startDate) {
      tempFiltered = tempFiltered.filter(item => {
        const itemDate = formatDateForComparison(item.date);
        return itemDate && itemDate >= dateRange.startDate;
      });
    }
    if (dateRange.endDate) {
      tempFiltered = tempFiltered.filter(item => {
        const itemDate = formatDateForComparison(item.date);
        return itemDate && itemDate <= dateRange.endDate;
      });
    }
    // If advanced barangay filter is set, it applies to the already tab-filtered data (or full data if tab is 'All')
    // OR: it could override tab filter. Current logic: Advanced barangay filters the result of tab filter.
    // To make advanced barangay filter override, apply it before tab filter or use only one source for barangay.
    // For clarity, let's assume advanced filter for barangay, if set, takes precedence over the tab filter.
    let baseForAdvancedFilter = [...inventory]; // Use full inventory if advanced barangay filter will take precedence
    if (barangay) { 
      baseForAdvancedFilter = baseForAdvancedFilter.filter(item => item.barangay === barangay);
      // If advanced barangay is set, we ignore activeBarangayFilter for this specific filter pass
      // and re-apply other advanced filters to this new base.
      // This requires restructuring the filter sequence or deciding on precedence.
      // Simpler: If advanced barangay is set, it's the only barangay filter. Otherwise, tab filter applies.
      tempFiltered = tempFiltered.filter(item => item.barangay === barangay); // Apply to current tempFiltered
    }

    if (street) {
      tempFiltered = tempFiltered.filter(item => item.street === street);
    }
    if (assignedTruck) {
      tempFiltered = tempFiltered.filter(item => item.assignedTruck === assignedTruck);
    }
    if (assignedDriver) {
      tempFiltered = tempFiltered.filter(item => item.assignedDriver === assignedDriver);
    }
    if (weightRange.min) {
      const minWeight = parseFloat(weightRange.min);
      if (!isNaN(minWeight)) {
        tempFiltered = tempFiltered.filter(item => parseWeight(item.weight) >= minWeight);
      }
    }
    if (weightRange.max) {
      const maxWeight = parseFloat(weightRange.max);
      if (!isNaN(maxWeight)) {
        tempFiltered = tempFiltered.filter(item => parseWeight(item.weight) <= maxWeight);
      }
    }

    if (searchTerm) {
      tempFiltered = tempFiltered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredInventory(tempFiltered);
  }, [inventory, activeBarangayFilter, searchTerm, advancedInventoryFilters]);

  const handleFilterClick = (barangay) => {
    setActiveBarangayFilter(barangay);
    // If a tab is clicked, and an advanced barangay filter is active, perhaps clear advanced barangay?
    // For now, they operate somewhat independently, with advanced potentially refining further or overriding.
    // To make tab selection clear advanced barangay filter:
    // setAdvancedInventoryFilters(prev => ({ ...prev, barangay: '', street: '' }));
  };

  const handleInputChangeOnForm = (e) => {
    const { name, value } = e.target;
    setNewInventoryItem(prev => {
      const updatedItem = { ...prev, [name]: value };
      if (name === 'barangay') {
        const streetsForBarangay = streetOptions[value] || [];
        updatedItem.street = streetsForBarangay.length > 0 ? streetsForBarangay[0] : '';
      }
      return updatedItem;
    });
  };

  const openAddModal = () => {
    setNewInventoryItem(initialFormState);
    setCurrentItem(null);
    setIsAddModalOpen(true);
    setIsEditModalOpen(false);
  };

  const openEditModal = (item) => {
    const [month, day, year] = item.date.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    let formattedTime = item.time;
    if (item.time) {
        const [timePart, modifier] = item.time.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (hours === '12') {
            hours = modifier.toLowerCase() === 'am' ? '00' : '12';
        } else if (modifier.toLowerCase() === 'pm' && parseInt(hours, 10) < 12) {
            hours = parseInt(hours, 10) + 12;
        }
        formattedTime = `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    setNewInventoryItem({
      barangay: item.barangay,
      street: item.street,
      scheduleDate: formattedDate,
      scheduleTime: formattedTime,
      assignedTruck: item.assignedTruck,
      assignedDriver: item.assignedDriver,
      weight: String(item.weight).replace(/kg|,/gi, ''),
    });
    setCurrentItem(item);
    setIsAddModalOpen(true); 
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentItem(null);
  };

  const handleSubmitInventory = (e) => {
    e.preventDefault();
    if (!newInventoryItem.weight || isNaN(parseWeight(newInventoryItem.weight))) {
      alert('Valid weight is required.');
      return;
    }
    
    const [year, month, day] = newInventoryItem.scheduleDate.split('-');
    const displayDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;

    let displayTime = newInventoryItem.scheduleTime;
    if (newInventoryItem.scheduleTime) {
        let [hours, minutes] = newInventoryItem.scheduleTime.split(':');
        const H = parseInt(hours, 10);
        const modifier = H >= 12 ? 'pm' : 'am';
        hours = H % 12 || 12; 
        displayTime = `${hours}:${minutes} ${modifier}`;
    }

    const itemToSave = {
      barangay: newInventoryItem.barangay, // ensure all fields from newInventoryItem are included
      street: newInventoryItem.street,
      scheduleDate: newInventoryItem.scheduleDate, // Store original form value if needed, or just display
      scheduleTime: newInventoryItem.scheduleTime,
      assignedTruck: newInventoryItem.assignedTruck,
      assignedDriver: newInventoryItem.assignedDriver,
      date: displayDate, // Display formatted date
      time: displayTime, // Display formatted time
      weight: `${parseWeight(newInventoryItem.weight)}kg`,
      status: 'recorded',
    };

    if (isEditModalOpen && currentItem) {
      setInventory(prevInv =>
        prevInv.map(item =>
          item.id === currentItem.id ? { ...itemToSave, id: currentItem.id } : item
        )
      );
    } else {
      const newItemWithId = { ...itemToSave, id: `inv${Date.now()}` };
      setInventory(prevInv => [newItemWithId, ...prevInv]);
    }
    closeModal();
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this inventory record?')) {
      setInventory(prevInv => prevInv.filter(item => item.id !== itemId));
    }
  };

  const handleGenerateReport = (itemId) => {
    alert(`Report generation initiated for item ID: ${itemId} (simulation)`);
  };

  const handleOpenInventoryFilterModal = () => setIsInventoryFilterModalOpen(true);
  const handleCloseInventoryFilterModal = () => setIsInventoryFilterModalOpen(false);
  const handleApplyAdvancedInventoryFilters = (appliedFilters) => {
    setAdvancedInventoryFilters(appliedFilters);
    // Determine if advanced barangay filter overrides tab filter for display purposes
    if (appliedFilters.barangay) {
        setActiveBarangayFilter('All'); // Or some indicator that advanced filter is in control
    }
  };

  const hasActiveAdvancedInventoryFilters = () => {
    const { dateRange, barangay, street, assignedTruck, assignedDriver, weightRange } = advancedInventoryFilters;
    return dateRange.startDate || dateRange.endDate || barangay || street || 
           assignedTruck || assignedDriver || weightRange.min || weightRange.max;
  };

  // Text for results info
  const getResultsInfoText = () => {
    let text = `Showing ${filteredInventory.length} of ${inventory.length} records`;
    if (searchTerm) text += ` matching "${searchTerm}"`;
    
    const advancedFilterActive = hasActiveAdvancedInventoryFilters();
    if (advancedFilterActive) {
        text += ' (with advanced filters applied';
        if (advancedInventoryFilters.barangay) {
            text += ` for ${advancedInventoryFilters.barangay}`;
        }
        text += ')';
    } else if (activeBarangayFilter !== 'All') {
        text += ` in ${activeBarangayFilter}`;
    }
    return text;
  };

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Garbage Collection Inventory</h1>
            <p className="text-gray-600">Manage and review recorded garbage collection details.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Print inventory records"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button
              onClick={openAddModal}
              aria-label="Add new inventory record"
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Add Inventory</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            {Object.entries(barangayCounts).map(([barangayKey, count]) => (
              <button
                key={barangayKey}
                onClick={() => handleFilterClick(barangayKey)}
                disabled={advancedInventoryFilters.barangay && advancedInventoryFilters.barangay !== barangayKey && barangayKey !== 'All'} // Disable tabs if adv barangay filter is active and different
                aria-pressed={activeBarangayFilter === barangayKey && !advancedInventoryFilters.barangay}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeBarangayFilter === barangayKey && !advancedInventoryFilters.barangay // Tab is active if no overriding advanced barangay filter
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:hover:bg-transparent'
                }`}
              >
                {barangayKey} ({count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                aria-label="Search all inventory fields"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64 lg:w-80 shadow-sm transition-all duration-200"
              />
            </div>
            <button 
              onClick={handleOpenInventoryFilterModal}
              aria-label="Open advanced inventory filters"
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 shadow-sm ${
                hasActiveAdvancedInventoryFilters()
                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveAdvancedInventoryFilters() && (
                <span className="w-2 h-2 bg-green-500 rounded-full ml-1" aria-hidden="true"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Barangay</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Street</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Truck</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Driver</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Weight</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item, index) => (
                <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.barangay === 'Bombongan' ? 'bg-green-100 text-green-800' :
                      item.barangay === 'San Juan' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800' // Fallback, though 'Other Barangay' is removed
                    }`}>
                      {item.barangay}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{item.street}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                         <CalendarDays className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item.date}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-400 mr-1.5 ml-0.5 flex-shrink-0" />
                        <span>{item.time}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                        <Truck className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item.assignedTruck}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">{item.assignedDriver}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <Weight className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800">{item.weight}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleGenerateReport(item.id)}
                        title="Generate Report"
                        aria-label={`Generate report for inventory ID ${item.id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-150"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        title="Modify"
                        aria-label={`Modify inventory ID ${item.id}`}
                        className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-md transition-colors duration-150"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        aria-label={`Delete inventory ID ${item.id}`}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-150"
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

        {filteredInventory.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Archive className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No inventory records found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria, or add a new inventory record.</p>
          </div>
        )}
      </div>
      
      {filteredInventory.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          {getResultsInfoText()}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" aria-hidden={!isAddModalOpen}>
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0"
               role="dialog" aria-modal="true" aria-labelledby="formModalTitle">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b bg-gray-50">
                <h2 id="formModalTitle" className="text-xl font-semibold text-gray-800">
                  {isEditModalOpen ? 'Modify Inventory Record' : 'Add New Inventory Record'}
                </h2>
                <button
                  onClick={closeModal}
                  aria-label="Close form modal"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitInventory} className="flex-1 p-6 space-y-5 overflow-y-auto">
                <div>
                  <label htmlFor="barangay" className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                  <select id="barangay" name="barangay" value={newInventoryItem.barangay} onChange={handleInputChangeOnForm} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    {barangayOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <select 
                    id="street" 
                    name="street" 
                    value={newInventoryItem.street} 
                    onChange={handleInputChangeOnForm} 
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    disabled={!newInventoryItem.barangay || (streetOptions[newInventoryItem.barangay] || []).length === 0}
                  >
                    {(streetOptions[newInventoryItem.barangay] || []).map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                 <div>
                  <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                  <input type="date" id="scheduleDate" name="scheduleDate" value={newInventoryItem.scheduleDate} onChange={handleInputChangeOnForm} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                  <input type="time" id="scheduleTime" name="scheduleTime" value={newInventoryItem.scheduleTime} onChange={handleInputChangeOnForm} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="assignedTruck" className="block text-sm font-medium text-gray-700 mb-1">Assigned Truck</label>
                  <select id="assignedTruck" name="assignedTruck" value={newInventoryItem.assignedTruck} onChange={handleInputChangeOnForm} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    {truckOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="assignedDriver" className="block text-sm font-medium text-gray-700 mb-1">Assigned Driver</label>
                  <select id="assignedDriver" name="assignedDriver" value={newInventoryItem.assignedDriver} onChange={handleInputChangeOnForm} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    {driverOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input type="text" id="weight" name="weight" value={newInventoryItem.weight} onChange={handleInputChangeOnForm} placeholder="e.g., 1800" className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required pattern="[0-9,.]*"/>
                </div>
              </form>

              <div className="p-5 border-t bg-gray-50">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit" 
                    onClick={handleSubmitInventory}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    {isEditModalOpen ? 'Save Changes' : 'Add Record'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <InventoryFilterModal
        isOpen={isInventoryFilterModalOpen}
        onClose={handleCloseInventoryFilterModal}
        filters={advancedInventoryFilters}
        onApplyFilters={handleApplyAdvancedInventoryFilters}
      />
    </div>
  );
};

export default GarbageCollectionInventory;