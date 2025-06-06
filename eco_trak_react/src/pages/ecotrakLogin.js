import React, { useState, useEffect, useCallback } from 'react';
import backgroundImage from '../assets/images/loginBackground.svg';
import ecotrakLogo from '../assets/images/ecotrakLogo.svg';
import morongLogo from '../assets/images/morongLogo.svg';
import { Eye, EyeOff, User, Lock, Mail, ArrowLeft, X, CheckCircle } from 'lucide-react';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
// Import the specific settings from firebaseConfig
import { auth, emailVerificationSettings, passwordResetSettings } from '../firebaseConfig'; // Updated import

const EcoTrakLogin = () => {
  const [currentStep, setCurrentStep] = useState('login'); // 'login', 'verify', or 'verified'
  const [formData, setFormData] = useState({email: '', password: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userCredential, setUserCredential] = useState(null); // Keep this for resend/manual check if needed
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState(null);
  const [loginNotification, setLoginNotification] = useState(null); // For password reset success notification

  const handleVerificationSuccess = useCallback(() => {
    const user = auth.currentUser;
    if (user) {
      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid, email: user.email, role: 'admin', emailVerified: true
      }));
      if (verificationTimer) {
        clearInterval(verificationTimer);
        setVerificationTimer(null);
      }
      //setCurrentStep('verified'); // REMOVE OR MAKE CONDITIONAL: This shows the "Email Verified!" message on the login page
      //setTimeout(() => {
      window.location.href = '/admin-dashboard'; // Redirect to dashboard
      //}, 1500); // If setCurrentStep is removed, the timeout can also be removed for immediate redirect.
    }
  }, [verificationTimer]);
  // Check for action success from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action'); // New param for specific post-verification handling
    const passwordAction = urlParams.get('passwordAction'); // Keep this for password reset flow

    if (action === 'emailNewlyVerified') {
      window.history.replaceState({}, document.title, window.location.pathname); // Clear param
      // Check if user's email is actually verified (it should be at this point)
      // Small delay to allow auth state to potentially update if needed, then check
      setTimeout(() => {
        if (auth.currentUser && auth.currentUser.emailVerified) {
          handleVerificationSuccess(); // This function already redirects to dashboard
        } else {
          // Fallback: if for some reason not verified, maybe show login or a message
          // This case should be rare if Firebase flow worked.
          setCurrentStep('login');
          setErrors({ general: 'Verification completed, please log in.'});
        }
      }, 500); // Short delay
    } else if (passwordAction === 'resetComplete') { // Existing password reset handling
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoginNotification({ type: 'success', message: 'Password reset successfully. You can now log in with your new password.' });
      setTimeout(() => setLoginNotification(null), 5000);
    }
    // The old 'isVerified' or 'emailAction=verified' param handling can be removed if 'action=emailNewlyVerified' replaces it
  }, [handleVerificationSuccess]); // Dependencies: ensure this runs correctly on component mount/param change

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified && currentStep === 'verify') {
        // If user verifies email while on the verification pending page
        handleVerificationSuccess();
      }
      // Optional: If user is already logged in and verified, redirect?
      // This might be handled by a ProtectedRoute component wrapping your dashboard
    });
    return () => unsubscribe();
  }, [currentStep, handleVerificationSuccess]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (verificationTimer) {
        clearInterval(verificationTimer);
      }
    };
  }, [verificationTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateLoginForm = () => { /* ... (no changes) ... */ 
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setIsLoading(true);
    setErrors({});
    setLoginNotification(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      console.log('Login successful:', credential.user);

      if (credential.user.emailVerified) {
        handleVerificationSuccess();
        return;
      }
      
      setUserCredential(credential); // Store credential
      // Send verification email using the imported settings
      await sendEmailVerification(credential.user, emailVerificationSettings); // Use imported settings
      
      setCurrentStep('verify');
      startVerificationPolling();
      
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.'; break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.'; break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.'; break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.'; break;
        default: // Keep default for other Firebase errors or unexpected issues
          errorMessage = 'Login failed. Please check your connection or try again later.'; 
      }
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const startVerificationPolling = () => { /* ... (no changes, this is a good fallback) ... */ 
    const timer = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(timer);
          setVerificationTimer(null);
          handleVerificationSuccess();
        }
      }
    }, 3000);
    setVerificationTimer(timer);
  };

  const handleManualVerification = async (e) => { /* ... (no changes, good fallback) ... */ 
    e.preventDefault();
    if (!userCredential && !auth.currentUser) { // Check auth.currentUser too
      setErrors({ verification: 'Session may have expired. Please login again.' });
      setCurrentStep('login');
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const userToCheck = userCredential ? userCredential.user : auth.currentUser;
      await userToCheck.reload();
      // Get fresh user data, directly from auth.currentUser is most reliable after reload
      const updatedUser = auth.currentUser; 
      if (updatedUser && updatedUser.emailVerified) {
        handleVerificationSuccess();
      } else {
        setErrors({ verification: 'Email not verified yet. Please check your email and click the verification link, then try this button again.' });
      }
    } catch (error) {
      console.error('Verification check failed:', error);
      setErrors({ verification: 'Failed to check verification status. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => { /* ... (no changes, use imported emailVerificationSettings) ... */ 
    const userForResend = userCredential ? userCredential.user : auth.currentUser;
    if (!userForResend) return;
    
    setIsLoading(true);
    setErrors({});
    try {
      await sendEmailVerification(userForResend, emailVerificationSettings); // Use imported settings
      setErrors({ verification: 'New verification email sent! Please check your inbox.' });
    } catch (error) {
      console.error('Failed to resend verification:', error);
      let errorMessage = 'Failed to resend verification email. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a moment before requesting another email.';
      }
      setErrors({ verification: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) {
      setErrors({ forgotPassword: 'Please enter your email address' });
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      // Use imported passwordResetSettings
      await sendPasswordResetEmail(auth, forgotPasswordEmail.trim(), passwordResetSettings);
      setForgotPasswordSuccess(true); // This will trigger the UI change in the modal
    } catch (error) {
      let errorMessage = 'Failed to send reset link. Please try again.';
      switch (error.code) {
        case 'auth/user-not-found': errorMessage = 'No user found with this email address.'; break;
        case 'auth/invalid-email': errorMessage = 'Invalid email address.'; break;
        case 'auth/network-request-failed': errorMessage = 'Network error. Please check your internet connection.'; break;
        default: errorMessage = error.message; // Or a generic message
      }
      setErrors({ forgotPassword: errorMessage });
      setForgotPasswordSuccess(false); // Ensure success is false on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseForgotPasswordModal = () => { /* ... (no changes) ... */ 
    setShowForgotPasswordModal(false);
    setForgotPasswordEmail('');
    setForgotPasswordSuccess(false);
    setErrors({});
  };
  
  const handleOpenForgotPasswordModal = () => { /* ... (no changes) ... */ 
    setShowForgotPasswordModal(true);
    setForgotPasswordEmail(formData.email || ''); // Pre-fill if email is available
    setForgotPasswordSuccess(false); // Reset success state
    setErrors({}); // Clear previous errors
  };

  const handleBackToLogin = () => { /* ... (no changes) ... */ 
    setCurrentStep('login');
    setErrors({});
    setUserCredential(null);
    if (verificationTimer) {
      clearInterval(verificationTimer);
      setVerificationTimer(null);
    }
  };

  const handleKeyPress = (e) => { /* ... (no changes) ... */ 
    if (e.key === 'Enter') {
      if (currentStep === 'login' && !showForgotPasswordModal) {
        handleLogin(e);
      } else if (currentStep === 'verify') {
        handleManualVerification(e);
      }
      // Note: Enter key press on forgot password modal is handled by its form's onSubmit
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* ... (background elements no change) ... */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600"></div>
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* ... (decorative elements no change) ... */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-white bg-opacity-5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            {/* ... (logo section no change) ... */}
            <div className="mb-4">
              <img src={ecotrakLogo} alt="EcoTrak Logo" className="w-68 h-24 mx-auto" />
            </div>
            <p className="text-lg font-medium text-gray-700">
              {currentStep === 'login' && 'Welcome to EcoTrak!'}
              {currentStep === 'verify' && 'Verify Your Email'}
              {currentStep === 'verified' && 'Email Verified!'}
            </p>
          </div>

          {currentStep === 'verify' && ( /* ... (Back button no change) ... */ 
            <button onClick={handleBackToLogin} className="flex items-center text-green-600 hover:text-green-800 mb-4 transition-colors" disabled={isLoading}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
            </button>
          )}
          
          {/* Login Page Notification Area */}
          {loginNotification && (
            <div className={`mb-4 p-3 border rounded-lg ${
              loginNotification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <p className="text-sm">{loginNotification.message}</p>
            </div>
          )}

          {errors.general || errors.verification ? ( /* ... (Error message display no change) ... */ 
             <div className={`mb-4 p-3 border rounded-lg ${ errors.verification && errors.verification.includes('sent') ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
              <p className="text-sm">{errors.general || errors.verification}</p>
            </div>
          ) : null}

          {currentStep === 'login' && ( /* ... (Login form structure no change, ensure onKeyPress={handleKeyPress} on inputs) ... */ 
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onKeyPress={handleKeyPress}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${ errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500' }`}
                    placeholder="Enter your email address" disabled={isLoading} autoComplete="email" />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleInputChange} onKeyPress={handleKeyPress}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${ errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500' }`}
                    placeholder="Enter your password" disabled={isLoading} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-transparent rounded-r-lg transition-colors" disabled={isLoading} tabIndex={0} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              {/* Forgot Password Link */}
              <div className="text-right">
                <button type="button" className="text-sm text-green-600 hover:text-green-800 underline transition-colors font-medium" disabled={isLoading} onClick={handleOpenForgotPasswordModal}>
                  Forgot Password?
                </button>
              </div>
              {/* Login Button */}
              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                {isLoading ? (<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Signing in...</div>) : ('Login')}
              </button>
            </form>
          )}

          {currentStep === 'verify' && ( /* ... (Verification form structure, button texts no change) ... */ 
            <div className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">Verification Email Sent</p>
                    <p className="text-sm text-blue-700">
                      We've sent a verification link to <strong>{formData.email || (userCredential?.user?.email)}</strong>. 
                      Please check your email and click the verification link from Firebase. The system will attempt to detect verification automatically.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 text-center">🔄 Automatically checking for email verification...</p>
              </div>
              <form onSubmit={handleManualVerification} className="space-y-4">
                <div className="text-center"><p className="text-sm text-gray-600 mb-4">Already clicked the link? Check manually:</p></div>
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                  {isLoading && errors.verification !== '' ? (<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Checking...</div>) : ('Check Verification Status')}
                </button>
                <div className="text-center">
                  <button type="button" onClick={handleResendVerification} disabled={isLoading} className="text-sm text-green-600 hover:text-green-800 underline transition-colors font-medium">
                    Didn't receive the email? Resend verification link
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 'verified' && ( /* ... (Verified success state, no change) ... */ 
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Email Verified!</h3>
              <p className="text-gray-600 mb-6">Your email has been successfully verified. Redirecting to dashboard...</p>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
                <span className="text-green-600 font-medium">Loading Dashboard</span>
              </div>
            </div>
          )}

          <div className="mt-8 text-center border-t pt-6"> {/* ... (Footer no change) ... */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 ml-24">©2025 EcoTrak. All Rights Reserved</p>
              <img src={morongLogo} alt="Morong Logo" className="h-12 w-auto " />
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal - MODIFIED */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={!isLoading ? handleCloseForgotPasswordModal : undefined}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <button onClick={!isLoading ? handleCloseForgotPasswordModal : undefined} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100" aria-label="Close modal" disabled={isLoading}>
              <X className="h-5 w-5" />
            </button>
            <div className="text-center mb-6">
              {/* ... (Modal header icon and text no change) ... */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"> <Lock className="h-8 w-8 text-green-600" /> </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{forgotPasswordSuccess ? 'Check Your Email' : 'Reset Password'}</h2>
              <p className="text-gray-600">{forgotPasswordSuccess ? 'We\'ve sent you a password reset link via Firebase.' : 'Enter your email to receive a reset link.'}</p>
            </div>

            {forgotPasswordSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  {/* ... (Success message structure no change) ... */}
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-800 font-medium mb-1">Password Reset Email Sent</p>
                      <p className="text-sm text-green-700">
                        We've sent a password reset link to <strong>{forgotPasswordEmail}</strong>. 
                        Check your inbox and follow the instructions from Firebase to reset your password.
                      </p>
                    </div>
                  </div>
                </div>
                {/* MODIFIED: Only show Close button */}
                <button
                  onClick={handleCloseForgotPasswordModal}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Reset Form - no change in structure */
              <form onSubmit={handleForgotPassword} className="space-y-5">
                {errors.forgotPassword && ( <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 text-sm">{errors.forgotPassword}</p></div> )}
                <div>
                  <label htmlFor="forgotEmail" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors ${errors.forgotPassword ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input type="email" id="forgotEmail" value={forgotPasswordEmail}
                      onChange={(e) => {
                        setForgotPasswordEmail(e.target.value);
                        if (errors.forgotPassword) setErrors(prev => ({ ...prev, forgotPassword: '' }));
                      }}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${ errors.forgotPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500' }`}
                      placeholder="Enter your email address" disabled={isLoading} autoComplete="email" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={handleCloseForgotPasswordModal} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Sending...</div>) : ('Send Reset Link')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoTrakLogin;