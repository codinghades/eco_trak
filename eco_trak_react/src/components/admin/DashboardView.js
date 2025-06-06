import React from 'react';
import { Link } from 'react-router-dom';

// Sample data - replace with actual data fetching later
const scheduleData = [
  { barangay: 'Bombongan', street: 'Aralar', schedule: '3/29/25 9:00 AM' },
  { barangay: 'Bombongan', street: 'Avenue Monique', schedule: '3/30/25 9:00 AM' },
  { barangay: 'San Juan', street: 'Ramos Boulevard', schedule: '4/01/25 8:00 AM' },
  { barangay: 'San Juan', street: 'Soriano', schedule: '3/31/25 9:00 AM' },
];

const pendingReportsData = [
  { id: '001', name: 'Joshua Ram...', barangay: 'Bombongan', street: 'Aralar', type: 'Missed Pickup' },
  // Add more sample reports
];

const DashboardView = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Top section with live status and filters */}
      <div className="flex flex-wrap items-center mb-6 gap-96">
        <div className="flex items-center space-x-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-md font-semibold text-gray-700">
            Live now: Brgy. Bombongan Alarar Street.
          </span>
        </div>
      </div>

      {/* Main content grid: Map and Schedule Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center border border-gray-200">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map Placeholder</p>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <p className="pt-0 p-2">Scheduled</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg">
                <tr>
                  <th scope="col" className="px-4 py-3">Barangay</th>
                  <th scope="col" className="px-4 py-3">Street</th>
                  <th scope="col" className="px-4 py-3">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.barangay}</td>
                    <td className="px-4 py-3">{item.street}</td>
                    <td className="px-4 py-3">{item.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Residents Reports Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold p-3 bg-green-100 text-green-800 rounded-t-lg -m-6 mb-4 px-6"> {/* Adjusted margin and padding to match screenshot's title style */}
          Pending residents reports
        </h2>
        <div className="overflow-x-auto mt-2"> {/* Added mt-2 for spacing after the re-styled h2 */}
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3">ID</th>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Barangay</th>
                <th scope="col" className="px-4 py-3">Street</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingReportsData.map((report) => (
                <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{report.id}</td>
                  <td className="px-4 py-3">{report.name}</td>
                  <td className="px-4 py-3">{report.barangay}</td>
                  <td className="px-4 py-3">{report.street}</td>
                  <td className="px-4 py-3">{report.type}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin-dashboard/reports/${report.id}`} className="font-medium text-green-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;