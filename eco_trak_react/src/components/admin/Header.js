import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, UserCircle2 } from 'lucide-react';
import { auth } from '../../firebaseConfig';
import ecotrakLogo from '../../assets/images/ecotrakLogo.svg'; // Ensure this path is correct

const Header = ({ adminName = "Admin" }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('userData');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8 w-full z-20">
      {/* Left side: Logo and Welcome Message */}
      <div className="flex items-center space-x-32">
        <img src={ecotrakLogo} alt="EcoTrak Logo" className="ml-12 h-16" /> {/* LOGO IS HERE */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 hidden sm:block">
          Welcome, Admin
        </h1>
      </div>

      {/* Right side: Icons and Logout */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button className="text-gray-500 hover:text-green-600 focus:outline-none p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button className="text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-full hover:bg-gray-100">
          <UserCircle2 className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-red-600 focus:outline-none py-2 px-3 rounded-md hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          <span className="text-xs md:text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;