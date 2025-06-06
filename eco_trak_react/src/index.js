import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EcoTrakLogin from './pages/ecotrakLogin';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import PasswordResetLanding from './pages/PasswordResetLanding';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/email-verified-confirmation" element={<EmailVerifiedPage />} />
        <Route path="/password-reset-landing" element={<PasswordResetLanding />} />
        <Route path="/login" element={<EcoTrakLogin />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/" element={<EcoTrakLogin />} />
      </Routes>
    </Router>
  </React.StrictMode>
);