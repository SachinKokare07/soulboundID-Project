import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PeraWalletConnect } from '@perawallet/connect';
import { verifyStudent } from '../utils/faceVerification';

const WalletPage = () => {
  const navigate = useNavigate();
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [stream, setStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check for connected wallet session
    const checkWalletConnection = async () => {
      try {
        const wallet = new PeraWalletConnect();
        let address = null;
        
        // Try to reconnect to wallet session
        try {
          const accounts = await wallet.reconnectSession();
          if (accounts.length > 0) {
            address = accounts[0];
            // Save to localStorage for persistence
            localStorage.setItem('connectedWallet', address);
          }
        } catch (reconnectError) {
          console.log('Could not reconnect wallet session:', reconnectError);
          // Fallback: Check localStorage for previously connected wallet
          const savedWallet = localStorage.getItem('connectedWallet');
          if (savedWallet) {
            address = savedWallet;
            console.log('Using saved wallet address from localStorage');
          }
        }
        
        if (address) {
          setConnectedWallet(address);
          
          // Check if student data exists for this wallet
          const studentsData = localStorage.getItem('students');
          if (studentsData) {
            const students = JSON.parse(studentsData);
            const student = students.find(s => s.walletAddress === address);
            if (student) {
              console.log('Student data loaded:', student);
              console.log('Verified status:', student.verified);
              console.log('Verification status:', student.verificationStatus);
              setStudentData(student);
            }
          }
        }
      } catch (error) {
        console.log('Error checking wallet connection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletConnection();
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Create Your Wallet',
      description: 'Set up your secure digital identity wallet in just a few clicks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Store Credentials',
      description: 'Safely store your verifiable credentials in your encrypted wallet',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Verify Your Identity',
      description: 'Complete a one-time verification process to ensure security',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Connect & Share',
      description: 'Securely share your credentials with verified platforms',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

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
    setVerificationMessage({ type: 'info', text: 'Comparing your live selfie with uploaded photo...' });

    try {
      // Call the verification function with live selfie
      const result = await verifyStudent(studentData, liveSelfie);

      if (result.success && result.verified) {
        // Update local storage
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const updatedStudents = students.map(s => 
          s.walletAddress === studentData.walletAddress 
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
        const updatedStudent = updatedStudents.find(s => s.walletAddress === studentData.walletAddress);
        setStudentData(updatedStudent);
        
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

  // Handle face verification - start camera for live selfie
  const handleVerification = async () => {
    if (!studentData) {
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

  // Show loading state
  if (isLoading) {
    return (
      <section className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet information...</p>
        </div>
      </section>
    );
  }

  // Show student profile if wallet is connected and verified
  if (connectedWallet && studentData) {
    return (
      <section className="bg-black text-white min-h-screen relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
          <div className="absolute right-0 top-20 w-150 h-150 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 blur-3xl transform rotate-45"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full mb-6 border border-gray-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Wallet Connected & Verified</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Your Digital Identity
            </h1>
            <p className="text-gray-400 text-sm font-mono">
              {connectedWallet.substring(0, 8)}...{connectedWallet.substring(connectedWallet.length - 6)}
            </p>
          </div>

          {/* Student Profile Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Header Section */}
              <div className="bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 p-8 text-center relative">
                <h2 className="text-3xl font-bold mb-2">Student Credentials</h2>
                <p className="text-white/90">Verified Digital Identity</p>
                
                {/* Verification Badge */}
                <div className="absolute top-4 right-4">
                  {studentData.verified ? (
                    <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-green-600">Verified</span>
                    </div>
                  ) : studentData.verificationStatus === 'pending' ? (
                    <div className="bg-gray-800 border border-gray-600 rounded-full px-4 py-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-blue-300">Pending</span>
                    </div>
                  ) : (
                    <div className="bg-gray-800 border border-gray-600 rounded-full px-4 py-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-300">Not Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Student Photo */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-300">Student Photo</h3>
                      <div className="aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-gray-800 bg-gray-800">
                        {studentData.photo ? (
                          <img 
                            src={studentData.photo} 
                            alt="Student" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No photo available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - ID Photo & Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-300">ID Card Photo</h3>
                      <div className="aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-gray-800 bg-gray-800">
                        {studentData.idPhoto ? (
                          <img 
                            src={studentData.idPhoto} 
                            alt="ID Card" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No ID photo available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                      <p className="text-lg font-semibold">{studentData.name}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">College/University</label>
                      <p className="text-lg font-semibold">{studentData.college}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">Department</label>
                      <p className="text-lg font-semibold">{studentData.department}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <label className="text-sm text-gray-400 block mb-1">Registration Date</label>
                      <p className="text-lg font-semibold">
                        {new Date(studentData.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className={`mt-6 rounded-lg p-6 border-2 ${
                    studentData.verified 
                      ? 'bg-green-900/20 border-green-700' 
                      : 'bg-yellow-900/20 border-yellow-700'
                  }`}>
                    <div className="flex items-start gap-4">
                      {studentData.verified ? (
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
                          studentData.verified ? 'text-green-300' : 'text-yellow-300'
                        }`}>
                          {studentData.verified ? 'Identity Verified' : 
                           studentData.verificationStatus === 'pending' ? 'Verification Pending' : 
                           'Verification Failed'}
                        </h4>
                        <p className="text-gray-300 mb-3">
                          {studentData.verified 
                            ? 'Your face has been successfully verified against your ID photo using AI face recognition technology.'
                            : studentData.verificationStatus === 'pending'
                            ? 'Your identity has not been verified yet. Click the button below to verify your identity using AI face recognition.'
                            : 'Face verification did not meet the confidence threshold. Your identity could not be verified. You can try again.'}
                        </p>
                        
                        {/* Debug info */}
                        <div className="text-xs text-gray-500 mb-2">
                          Status: verified={String(studentData.verified)}, verificationStatus={studentData.verificationStatus || 'undefined'}
                        </div>
                        
                        {/* Get Verified Button - Shows for unverified users */}
                        {(!studentData.verified || studentData.verificationStatus === 'pending' || studentData.verificationStatus === 'failed') && (
                          <div className="mt-4">
                            <button
                              onClick={handleVerification}
                              disabled={isVerifying}
                              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-white shadow-lg border-2 border-green-500"
                            >
                              {isVerifying ? (
                                <>
                                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Verifying Your Identity...
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
                        
                        {studentData.verificationConfidence !== undefined && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Verification Confidence:</span>
                              <span className={`font-semibold ${
                                studentData.verified ? 'text-green-300' : 'text-yellow-300'
                              }`}>
                                {studentData.verificationConfidence.toFixed(2)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  studentData.verified ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min(studentData.verificationConfidence, 100)}%` }}
                              ></div>
                            </div>
                            {studentData.verificationDate && (
                              <p className="text-xs text-gray-500 mt-2">
                                Verified on: {new Date(studentData.verificationDate).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                            {studentData.mockVerification && (
                              <p className="text-xs text-blue-400 mt-2">
                                Note: Mock verification mode (Face++ API not configured)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
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

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => {
                      // Download credential as JSON
                      const dataStr = JSON.stringify(studentData, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `credential-${studentData.name.replace(/\s+/g, '_')}.json`;
                      link.click();
                    }}
                    className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-lg font-medium transition-colors"
                  >
                    Download Credential
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show wallet connected but not registered message
  if (connectedWallet && !studentData) {
    return (
      <section className="bg-black text-white min-h-screen relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
          <div className="absolute right-0 top-20 w-150 h-150 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 blur-3xl transform rotate-45"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            {/* Connected Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900 border border-green-700 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-200">Wallet Connected</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Complete Your Registration
            </h1>
            
            <p className="text-xl text-gray-400 mb-6">
              Your wallet is connected but you haven't completed your profile yet.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 inline-block">
              <p className="text-sm text-gray-400 mb-1">Connected Wallet Address:</p>
              <p className="text-sm font-mono text-purple-400">
                {connectedWallet.substring(0, 10)}...{connectedWallet.substring(connectedWallet.length - 10)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/student-info', { state: { walletAddress: connectedWallet } })}
                className="bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105 duration-300 inline-flex items-center gap-2"
              >
                Complete Registration
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('connectedWallet');
                  window.location.reload();
                }}
                className="bg-gray-800 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-700 transition-all"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show wallet connection flow if not connected or not verified
  return (
    <section className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
        <div className="absolute right-0 top-20 w-150 h-150 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 blur-3xl transform rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full mb-6 border border-gray-800">
            <span className="text-sm text-gray-300">Your Digital Identity Wallet</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Connect Your Wallet
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Create a secure, blockchain-based identity wallet to manage your verifiable credentials and connect with platforms seamlessly.
          </p>
        </div>

        {/* Connect Button Section - Moved to Top */}
        <div className="text-center mb-16">
          <button
            onClick={() => navigate('/connect')}
            className="bg-white text-black px-12 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105 duration-300 text-lg inline-flex items-center gap-3 shadow-2xl"
          >
            Connect Pera Wallet
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-gray-400 text-sm mt-4 max-w-lg mx-auto">
            Click to connect via QR code (desktop) or app redirect (mobile)
          </p>
        </div>

        {/* Information Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div 
                key={step.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all hover:transform hover:scale-105 duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-purple-600 to-pink-500 rounded-lg mb-4">
                  {step.icon}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold bg-gray-800 px-3 py-1 rounded-full">Step {step.id}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice Section */}
        <div className="bg-linear-to-r from-purple-900 to-pink-900 border border-purple-700 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                Important for Students
                <span className="bg-white text-purple-600 text-xs px-3 py-1 rounded-full font-semibold">Required</span>
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                Before proceeding, please ensure you have the <span className="font-bold text-white">Pera Wallet</span> application installed on your mobile device.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <a
                  href="https://play.google.com/store/apps/details?id=com.algorand.android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Download for Android
                </a>
                <a
                  href="https://apps.apple.com/app/algorand-wallet/id1459898525"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                  </svg>
                  Download for iOS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal for Live Selfie */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border-2 border-purple-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">📸 Capture Live Selfie</h3>
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
    </section>
  );
};

export default WalletPage;
