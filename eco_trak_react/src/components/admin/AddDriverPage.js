import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { ArrowLeft, User, Phone, Mail, Lock, MapPin, Truck, Calendar, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Predefined data
const PREDEFINED_TRUCKS = [
  'Truck001', 'Truck002', 'Truck003', 'Truck004', 'Truck005',
  'Truck006', 'Truck007', 'Truck008', 'Truck009', 'Truck010'
];

const BARANGAY_STREETS = {
  'Bombongan': ['Aralar St.', 'Avenue Monique'],
  'San Juan': ['T. Claudio St.']
};

// Generate 6-digit random ID
const generateDriverId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const AddDriverPage = ({ onNavigateBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    email: '',
    password: '',
    assignedBarangay: '',
    assignedStreets: [],
    assignedTruck: ''
  });

  // Available streets based on selected barangay
  const availableStreets = formData.assignedBarangay ? BARANGAY_STREETS[formData.assignedBarangay] : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset streets when barangay changes
    if (name === 'assignedBarangay') {
      setFormData(prev => ({ ...prev, assignedStreets: [] }));
    }
  };

  const handleStreetToggle = (street) => {
    setFormData(prev => ({
      ...prev,
      assignedStreets: prev.assignedStreets.includes(street)
        ? prev.assignedStreets.filter(s => s !== street)
        : [...prev.assignedStreets, street]
    }));
    
    // Clear street error
    if (errors.assignedStreets) {
      setErrors(prev => ({ ...prev, assignedStreets: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Driver name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.assignedBarangay) newErrors.assignedBarangay = 'Barangay is required';
    if (formData.assignedStreets.length === 0) newErrors.assignedStreets = 'At least one street must be selected';
    if (!formData.assignedTruck) newErrors.assignedTruck = 'Assigned truck is required';

    // Age validation
    if (formData.age && (formData.age < 18 || formData.age > 65)) {
      newErrors.age = 'Age must be between 18 and 65';
    }

    // Contact validation (Philippine mobile format)
    if (formData.contact && !/^(09|\+639)\d{9}$/.test(formData.contact.replace(/\s+/g, ''))) {
      newErrors.contact = 'Please enter a valid Philippine mobile number';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    // Store current admin user
    const currentUser = auth.currentUser;

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const newUser = userCredential.user;
      const driverId = generateDriverId();

      // Send email verification
      await sendEmailVerification(newUser);

      // Prepare driver data for Firestore
      const driverData = {
        id: driverId, // 6-digit random ID
        name: formData.name.trim(),
        age: parseInt(formData.age),
        contact: formData.contact.trim(),
        email: formData.email.trim(),
        assignedTruck: formData.assignedTruck,
        assignedRoute: formData.assignedStreets.join(', '),
        assignedStreets: formData.assignedStreets,
        assignedBarangay: formData.assignedBarangay,
        role: 'driver',
        createdAt: new Date(),
        emailVerified: false,
        uid: newUser.uid
      };

      // Store driver data in Firestore
      await setDoc(doc(db, 'drivers', newUser.uid), driverData);

      // Sign out the newly created driver and re-sign in admin
      await auth.signOut();
      
      // If there was an admin user, sign them back in
      // Note: You might want to store admin credentials or handle this differently
      // For now, we'll just leave them signed out and they can sign back in

      // Show success message
      setSuccessMessage(
        `Driver account created successfully! Driver ID: ${driverId}. Verification email sent to ${formData.email}`
      );

      // Reset form
      setFormData({
        name: '',
        age: '',
        contact: '',
        email: '',
        password: '',
        assignedBarangay: '',
        assignedStreets: [],
        assignedTruck: ''
      });

      // Auto-hide success message after 7 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 7000);

    } catch (error) {
      console.error('Error creating driver:', error);
      let errorMessage = 'Failed to create driver account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
        setErrors({ email: errorMessage });
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
        setErrors({ password: errorMessage });
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
        setErrors({ email: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }

      // Re-sign in admin if there was an error
      if (currentUser) {
        try {
          await signInWithEmailAndPassword(auth, currentUser.email, 'admin-password');
        } catch (signInError) {
          console.error('Error re-signing in admin:', signInError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Drivers</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Driver</h1>
            <p className="text-gray-600">Create a new driver account with assigned truck and route</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error!</p>
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Driver Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter driver's full name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      min="18"
                      max="65"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                        errors.age ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.age}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="09XXXXXXXXX"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                        errors.contact ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.contact && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="driver@example.com"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password (min. 6 characters)"
                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Assignment Information Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                Assignment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Assigned Barangay */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Barangay <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="assignedBarangay"
                    value={formData.assignedBarangay}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.assignedBarangay ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Barangay</option>
                    <option value="Bombongan">Bombongan</option>
                    <option value="San Juan">San Juan</option>
                  </select>
                  {errors.assignedBarangay && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.assignedBarangay}
                    </p>
                  )}
                </div>

                {/* Assigned Truck */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Truck <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="assignedTruck"
                      value={formData.assignedTruck}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors appearance-none ${
                        errors.assignedTruck ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Truck</option>
                      {PREDEFINED_TRUCKS.map(truck => (
                        <option key={truck} value={truck}>{truck}</option>
                      ))}
                    </select>
                  </div>
                  {errors.assignedTruck && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.assignedTruck}
                    </p>
                  )}
                </div>
              </div>

              {/* Assigned Streets */}
              {formData.assignedBarangay && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Assigned Streets <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {availableStreets.map(street => (
                      <label key={street} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200">
                        <input
                          type="checkbox"
                          checked={formData.assignedStreets.includes(street)}
                          onChange={() => handleStreetToggle(street)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{street}</span>
                      </label>
                    ))}
                  </div>
                  {errors.assignedStreets && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.assignedStreets}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5" />
                      Create Driver Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriverPage;