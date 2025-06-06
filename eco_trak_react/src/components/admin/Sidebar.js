// Sidebar.js (Updated)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Truck, CalendarDays, FileText, Archive } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
    { name: 'Barangay Users', icon: Users, path: '/admin-dashboard/users' },
    { name: 'Truck & Driver', icon: Truck, path: '/admin-dashboard/trucks' },
    { name: 'Schedule', icon: CalendarDays, path: '/admin-dashboard/schedule' },
    { name: 'Reports', icon: FileText, path: '/admin-dashboard/reports' },
    { name: 'Inventory', icon: Archive, path: '/admin-dashboard/inventory' },
  ];

  return (
    // This div is now part of a flex row in AdminDashboard, below the Header
    // It should take the full height available in that flex container.
    <div className="w-64 bg-[#203C2B] text-white flex flex-col h-full"> {/* Removed fixed positioning, h-full for flex child */}
      {/* Logo section removed */}
      <nav className="flex-grow pt-6 space-y-2 px-4"> {/* Added pt-6 since logo area is gone */}
        {navItems.map((item) => {
          // Logic for isActive (simplified for clarity, assuming location.pathname directly matches item.path)
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center py-3 px-4 rounded-md text-sm transition-colors duration-200
                ${
                  isActive
                    ? 'bg-[#A7D7C5] text-[#203C2B] font-medium'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#203C2B]' : 'text-white'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;