import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyStudent } from '../utils/faceVerification';

const ViewStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Load students from localStorage
    const studentsData = localStorage.getItem('students');
    if (studentsData) {
      try {
        const parsed = JSON.parse(studentsData);
        setStudents(parsed);
      } catch (error) {
        console.error('Error parsing student data:', error);
      }
    }
  }, []);

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete all student data?')) {
      localStorage.removeItem('students');
      setStudents([]);
      setSelectedStudent(null);
    }
  };

  // Camera functions for live selfie capture
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Camera access error:', error);
      setVerificationMessage({ 
        type: 'error', 
        text: 'Failed to access camera. Please allow camera permissions.' 
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  };

  const handleCaptureSelfie = async () => {
    const liveSelfie = captureSelfie();
    if (!liveSelfie) {
      setVerificationMessage({ type: 'error', text: 'Failed to capture selfie' });
      return;
    }

    stopCamera();
    setIsVerifying(true);
    setVerificationMessage({ type: 'info', text: 'Comparing live selfie with uploaded photo...' });

    try {
      // Call the verification function with live selfie
      const result = await verifyStudent(selectedStudent, liveSelfie);

      if (result.success && result.verified) {
        // Update local storage
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const updatedStudents = students.map(s => 
          s.walletAddress === selectedStudent.walletAddress 
            ? { 
                ...s, 
                verified: true, 
                verificationStatus: 'verified',
                verificationConfidence: result.confidence,
                verificationDate: new Date().toISOString(),
                mockVerification: result.mockVerification || false
              }
            : s
        );
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        
        // Update state
        setStudents(updatedStudents);
        const updatedStudent = updatedStudents.find(s => s.walletAddress === selectedStudent.walletAddress);
        setSelectedStudent(updatedStudent);
        
        setVerificationMessage({ 
          type: 'success', 
          text: `✅ ${result.message}` 
        });
      } else {
        setVerificationMessage({ 
          type: 'error', 
          text: `❌ ${result.message}` 
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationMessage({ 
        type: 'error', 
        text: `Error during verification: ${error.message}` 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerification = async (student) => {
    if (!student) {
      setVerificationMessage({ type: 'error', text: 'No student data found' });
      return;
    }
    await startCamera();
  };

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (students.length === 0) {
    return (
      <section className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">No Students Found</h2>
          <p className="text-gray-400 mb-8">
            No student data is stored yet. Connect your wallet and register to see your information here.
          </p>
          <button
            onClick={() => navigate('/wallet')}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Go to Wallet
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
        <div className="absolute right-0 top-20 w-150 h-150 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 blur-3xl transform rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Registered Students</h1>
          <p className="text-gray-400 mb-6">
            Total Students: <span className="text-white font-semibold">{students.length}</span>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-lg font-medium transition-colors border border-gray-800"
            >
              Back to Home
            </button>
            <button
              onClick={clearAllData}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {students.map((student, index) => (
            <div 
              key={index}
              onClick={() => setSelectedStudent(student)}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all cursor-pointer transform hover:scale-105 duration-300"
            >
              {/* Photo */}
              <div className="aspect-square bg-gray-800">
                {student.photo ? (
                  <img 
                    src={student.photo} 
                    alt={student.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold truncate flex-1">{student.name}</h3>
                  {student.verified ? (
                    <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 shrink-0">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="ml-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-semibold shrink-0">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-1 truncate">{student.college}</p>
                <p className="text-sm text-gray-500 mb-3 truncate">{student.department}</p>
                <div className="bg-gray-800 rounded px-3 py-1 text-xs font-mono text-gray-400 truncate">
                  {student.walletAddress?.substring(0, 8)}...{student.walletAddress?.substring(student.walletAddress.length - 6)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Student Modal */}
        {selectedStudent && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <div 
              className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-6 flex justify-between items-center relative">
                <div>
                  <h2 className="text-2xl font-bold">Student Details</h2>
                </div>
                <div className="flex items-center gap-3">
                  {selectedStudent.verified ? (
                    <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-green-600">Verified</span>
                    </div>
                  ) : (
                    <div className="bg-gray-800 border border-gray-600 rounded-full px-4 py-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-blue-300">Pending</span>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Student Photo */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-300">Student Photo</h3>
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-800 bg-gray-800">
                      {selectedStudent.photo ? (
                        <img 
                          src={selectedStudent.photo} 
                          alt="Student" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No photo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID Photo */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-300">ID Card Photo</h3>
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-800 bg-gray-800">
                      {selectedStudent.idPhoto ? (
                        <img 
                          src={selectedStudent.idPhoto} 
                          alt="ID Card" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No ID photo
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                      <p className="text-lg font-semibold">{selectedStudent.name}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">College/University</label>
                      <p className="text-lg font-semibold">{selectedStudent.college}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">Department</label>
                      <p className="text-lg font-semibold">{selectedStudent.department}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">Registration Date</label>
                      <p className="text-lg font-semibold">
                        {new Date(selectedStudent.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <label className="text-sm text-gray-400 block mb-1">Wallet Address</label>
                    <p className="text-sm font-mono break-all">{selectedStudent.walletAddress}</p>
                  </div>
                </div>

                {/* Verification Section */}
                <div className={`mt-6 rounded-lg p-6 border-2 ${
                  selectedStudent.verified 
                    ? 'bg-green-900/20 border-green-700' 
                    : 'bg-yellow-900/20 border-yellow-700'
                }`}>
                  <div className="flex items-start gap-4">
                    {selectedStudent.verified ? (
                      <svg className="w-8 h-8 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    <div className="flex-1">
                      <h4 className={`text-xl font-bold mb-2 ${
                        selectedStudent.verified ? 'text-green-300' : 'text-yellow-300'
                      }`}>
                        {selectedStudent.verified ? 'Identity Verified' : 
                         selectedStudent.verificationStatus === 'pending' ? 'Verification Pending' : 
                         'Not Verified'}
                      </h4>
                      <p className="text-gray-300 mb-3">
                        {selectedStudent.verified 
                          ? 'Face has been successfully verified against ID photo using AI face recognition.'
                          : selectedStudent.verificationStatus === 'pending'
                          ? 'This student has not been verified yet. Click the button below to verify using AI face recognition.'
                          : 'Face verification did not meet the confidence threshold. You can try again.'}
                      </p>
                      
                      {/* Get Verified Button */}
                      {!selectedStudent.verified && (
                        <div className="mt-4">
                          <button
                            onClick={() => handleVerification(selectedStudent)}
                            disabled={isVerifying}
                            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-white shadow-lg border-2 border-green-500"
                          >
                            {isVerifying ? (
                              <>
                                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying Identity...
                              </>
                            ) : (
                              <>
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                🔐 Get Verified with AI
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {/* Verification Details */}
                      {selectedStudent.verificationConfidence !== undefined && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Verification Confidence:</span>
                            <span className={`font-semibold ${
                              selectedStudent.verified ? 'text-green-300' : 'text-yellow-300'
                            }`}>
                              {selectedStudent.verificationConfidence.toFixed(2)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                selectedStudent.verified ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min(selectedStudent.verificationConfidence, 100)}%` }}
                            ></div>
                          </div>
                          {selectedStudent.verificationDate && (
                            <p className="text-xs text-gray-500 mt-2">
                              Verified on: {new Date(selectedStudent.verificationDate).toLocaleString()}
                            </p>
                          )}
                          {selectedStudent.mockVerification && (
                            <p className="text-xs text-blue-400 mt-2">
                              Note: Mock verification mode (Face++ API not configured)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Message */}
                {verificationMessage && (
                  <div className={`mt-6 rounded-lg p-4 border ${
                    verificationMessage.type === 'success' ? 'bg-green-900/30 border-green-700' :
                    verificationMessage.type === 'error' ? 'bg-red-900/30 border-red-700' :
                    verificationMessage.type === 'warning' ? 'bg-yellow-900/30 border-yellow-700' :
                    'bg-blue-900/30 border-blue-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      {verificationMessage.type === 'success' ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : verificationMessage.type === 'error' ? (
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : verificationMessage.type === 'warning' ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <p className={`flex-1 ${
                        verificationMessage.type === 'success' ? 'text-green-200' :
                        verificationMessage.type === 'error' ? 'text-red-200' :
                        verificationMessage.type === 'warning' ? 'text-yellow-200' :
                        'text-blue-200'
                      }`}>
                        {verificationMessage.text}
                      </p>
                      {verificationMessage.type !== 'info' && (
                        <button
                          onClick={() => setVerificationMessage(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Camera Modal for Live Selfie */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border-2 border-purple-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">📸 Capture Live Selfie for Verification</h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-400 hover:text-white"
                  disabled={isVerifying}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 text-gray-300 text-sm">
                <p>📌 Look directly at the camera and make sure your face is clearly visible</p>
                <p>💡 Ensure good lighting for best results</p>
                <p>🔍 We'll compare this with your uploaded photo</p>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-80 border-4 border-dashed border-green-500 rounded-full opacity-50"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={stopCamera}
                  disabled={isVerifying}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCaptureSelfie}
                  disabled={isVerifying}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Capture & Verify
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewStudents;
