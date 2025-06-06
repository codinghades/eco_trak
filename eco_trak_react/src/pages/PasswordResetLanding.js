// src/pages/PasswordResetLanding.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/loginBackground.svg';
import ecotrakLogo from '../assets/images/ecotrakLogo.svg';
import { CheckCircle } from 'lucide-react';

const PasswordResetLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login?passwordAction=resetComplete');
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600"></div>
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="mb-4">
              <img
                src={ecotrakLogo}
                alt="EcoTrak Logo"
                className="w-32 h-32 mx-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">EcoTrak Admin</h1>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You will be redirected to the login page to sign in with your new password.
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-2"></div>
              <span className="text-green-600 text-sm">Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetLanding;