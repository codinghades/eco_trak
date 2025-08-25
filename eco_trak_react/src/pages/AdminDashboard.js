// AdminDashboard.js (Updated Layout)
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import DashboardView from '../components/admin/DashboardView'; // Default view
import BarangayUsersView from '../components/admin/BarangayUsersView';
import TruckDriverView from '../components/admin/TruckDriverView';
import CollectionScheduleManagement from '../components/admin/CollectionScheduleManagement';
import ReportsComplaintsManagement from '../components/admin/ReportsComplaintsManagement';
import GarbageCollectionInventory from '../components/admin/GarbageCollectionInventory';
import { auth } from '../firebaseConfig';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.email) {
          setAdminName(userData.email.split('@')[0] || "Admin");
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const isBaseDashboardRoute = location.pathname === '/admin-dashboard' || location.pathname === '/admin-dashboard/';

  return (
    <div className="h-screen flex flex-col bg-gray-100"> {/* Main container for the whole page */}
      <Header adminName={adminName} /> {/* Header takes full width at the top */}
      
      <div className="flex flex-1 overflow-hidden"> {/* Container for Sidebar and Main Content Area */}
        <Sidebar /> {/* Sidebar on the left, takes available height */}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {isBaseDashboardRoute ? (
            <DashboardView />
          ) : (
            <Routes>
              <Route path="users" element={<BarangayUsersView />} />
              <Route path="trucks" element={<TruckDriverView />} />
              <Route path="drivers" element={<TruckDriverView />} />
              {/* Add other routes as needed */}
              <Route path="schedule" element={<CollectionScheduleManagement />} />
              <Route path="reports" element={<ReportsComplaintsManagement />} />
              <Route path="inventory" element={<GarbageCollectionInventory />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;