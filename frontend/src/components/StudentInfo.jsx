import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase/config';

const StudentInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const walletAddress = location.state?.walletAddress || localStorage.getItem('connectedWallet') || '';

  // Redirect to connect page if no wallet is connected
  useEffect(() => {
    if (!walletAddress) {
      console.log('No wallet address found, redirecting to connect page');
      navigate('/connect');
    }
  }, [walletAddress, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
  });

  const [photo, setPhoto] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [idPhotoBase64, setIdPhotoBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB');
        return;
      }
      setPhoto(file);
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      
      // Convert to base64 for storage
      try {
        const base64 = await fileToBase64(file);
        setPhotoBase64(base64);
      } catch (err) {
        console.error('Error converting photo:', err);
      }
    }
  };

  const handleIdPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('ID photo size should be less than 5MB');
        return;
      }
      setIdPhoto(file);
      const preview = URL.createObjectURL(file);
      setIdPhotoPreview(preview);
      
      // Convert to base64 for storage
      try {
        const base64 = await fileToBase64(file);
        setIdPhotoBase64(base64);
      } catch (err) {
        console.error('Error converting ID photo:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.college || !formData.department) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (!photo || !idPhoto) {
      setError('Please upload both photo and ID photo');
      setIsSubmitting(false);
      return;
    }

    if (!walletAddress) {
      setError('Wallet address not found. Please connect your wallet first.');
      setIsSubmitting(false);
      return;
    }

    try {
      const studentData = {
        name: formData.name,
        college: formData.college,
        department: formData.department,
        photo: photoBase64,
        idPhoto: idPhotoBase64,
        walletAddress,
        timestamp: new Date().toISOString(),
        verified: false,
        verificationStatus: 'pending'
      };

      // Save to localStorage
      const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
      existingStudents.push(studentData);
      localStorage.setItem('students', JSON.stringify(existingStudents));
      
      // Also save to Firestore if configured
      if (db) {
        try {
          const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
          await addDoc(collection(db, 'students'), {
            name: formData.name,
            college: formData.college,
            department: formData.department,
            photoBase64: photoBase64,
            idPhotoBase64: idPhotoBase64,
            walletAddress,
            verified: false,
            verificationStatus: 'pending',
            createdAt: serverTimestamp(),
          });
          console.log('Data saved to Firestore');
        } catch (firestoreError) {
          console.log('Firestore not configured, data saved to localStorage only');
        }
      }

      console.log('Student data saved successfully');
      
      // Save wallet address to localStorage for session persistence
      localStorage.setItem('connectedWallet', walletAddress);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/wallet');
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-400">Redirecting to your wallet page...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white min-h-screen relative overflow-hidden py-16">
      {/* Background Gradient */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
        <div className="absolute right-0 top-20 w-150 h-150 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 blur-3xl transform rotate-45"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full mb-6 border border-gray-800">
            <span className="text-sm text-gray-300">Student Registration</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-gray-400 text-lg">
            Please provide your information to complete the registration
          </p>

          {walletAddress && (
            <div className="mt-4 bg-gray-900 border border-gray-800 rounded-lg p-3 inline-block">
              <p className="text-sm text-gray-400">Connected Wallet:</p>
              <p className="text-sm font-mono text-purple-400">
                {walletAddress.slice(0, 10)}...{walletAddress.slice(-10)}
              </p>
            </div>
          )}
        </div>

        {/* Registration Info */}
        <div className="mb-8 bg-blue-900/20 border border-blue-700 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Registration & Verification</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Complete your registration with your information and photos. After registration, you can verify your identity using AI face recognition from your wallet page.
                <span className="font-semibold text-white"> Make sure both photos show your face clearly</span> for accurate verification later.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-200 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* College */}
          <div>
            <label htmlFor="college" className="block text-sm font-medium mb-2">
              College/University <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your college name"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your department"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Photo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-700"
                />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-center hover:border-purple-500 transition-all">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-400">
                    {photo ? photo.name : 'Click to upload photo'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          {/* ID Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ID Card Photo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {idPhotoPreview && (
                <img
                  src={idPhotoPreview}
                  alt="ID Preview"
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-700"
                />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-center hover:border-purple-500 transition-all">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <p className="text-sm text-gray-400">
                    {idPhoto ? idPhoto.name : 'Click to upload ID card'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdPhotoChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>



          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Complete Registration
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default StudentInfo;
