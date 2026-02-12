import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PeraWalletConnect } from '@perawallet/connect';

const ConnectPage = () => {
  const navigate = useNavigate();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [peraWallet, setPeraWallet] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Pera Wallet
  useEffect(() => {
    const wallet = new PeraWalletConnect();
    setPeraWallet(wallet);

    // Reconnect to session if exists
    wallet.reconnectSession().then((accounts) => {
      if (accounts.length > 0) {
        const address = accounts[0];
        setAccountAddress(address);
        // Save to localStorage
        localStorage.setItem('connectedWallet', address);
      }
    }).catch((error) => {
      console.log('No existing session', error);
      // Check localStorage as fallback
      const savedWallet = localStorage.getItem('connectedWallet');
      if (savedWallet) {
        setAccountAddress(savedWallet);
      }
    });

    return () => {
      wallet?.disconnect();
    };
  }, []);

  const walletOptions = [
    {
      id: 'pera',
      name: 'Pera Wallet',
      description: 'Official Algorand wallet - QR code on desktop, app redirect on mobile',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      popular: true,
      available: true
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Coming soon - MetaMask integration',
      icon: (
        <svg className="w-12 h-12 opacity-50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.713 7.288l-8.437-6.268a1.5 1.5 0 00-1.776 0L4.063 7.288a1.5 1.5 0 00-.563 1.175v7.074c0 .466.217.905.588 1.188l8.437 6.455a1.5 1.5 0 001.776 0l8.437-6.455a1.5 1.5 0 00.588-1.188V8.463a1.5 1.5 0 00-.563-1.175z" />
        </svg>
      ),
      popular: false,
      available: false
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Coming soon - WalletConnect integration',
      icon: (
        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      popular: false,
      available: false
    }
  ];

  const handleConnect = async (walletId) => {
    if (walletId !== 'pera') {
      setError('Currently only Pera Wallet is supported');
      return;
    }

    if (!peraWallet) {
      setError('Wallet not initialized');
      return;
    }

    setSelectedWallet(walletId);
    setIsConnecting(true);
    setError(null);
    
    try {
      // Connect to Pera Wallet
      // On desktop: Shows QR code modal
      // On mobile: Redirects to Pera Wallet app
      const accounts = await peraWallet.connect();
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setAccountAddress(address);
        console.log('Connected to Pera Wallet:', address);
        
        // Save wallet address to localStorage for persistence
        localStorage.setItem('connectedWallet', address);
        
        // Check if user is already registered
        const studentsData = localStorage.getItem('students');
        if (studentsData) {
          const students = JSON.parse(studentsData);
          const existingStudent = students.find(s => s.walletAddress === address);
          if (existingStudent) {
            // User already registered, go to wallet page
            console.log('Existing user found, redirecting to wallet page');
            setTimeout(() => {
              navigate('/wallet');
            }, 1000);
            return;
          }
        }
        
        // New user, navigate to student info page
        setTimeout(() => {
          navigate('/student-info', { state: { walletAddress: address } });
        }, 1000);
      }
    } catch (error) {
      console.error('Connection error:', error);
      if (error?.message) {
        setError(error.message);
      } else {
        setError('Failed to connect to Pera Wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (peraWallet) {
      await peraWallet.disconnect();
      setAccountAddress(null);
      setSelectedWallet(null);
      setError(null);
      // Clear localStorage
      localStorage.removeItem('connectedWallet');
    }
  };

  return (
    <section className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute left-0 top-0 w-1/2 h-full opacity-20">
        <div className="absolute left-0 top-40 w-125 h-125 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 blur-3xl"></div>
      </div>
      <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20">
        <div className="absolute right-0 bottom-40 w-125 h-125 bg-linear-to-br from-orange-500 via-pink-500 to-purple-600 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/wallet')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Wallet Info
        </button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full mb-6 border border-gray-800">
            <span className="text-sm text-gray-300">Secure Connection</span>
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Choose Your Wallet
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select your preferred wallet to connect and start managing your digital identity credentials securely.
          </p>
        </div>

        {/* Connected Status */}
        {accountAddress && (
          <div className="bg-linear-to-r from-green-900 to-emerald-900 border border-green-700 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Wallet Connected</h3>
                  <p className="text-green-200 text-sm font-mono">
                    {accountAddress.slice(0, 8)}...{accountAddress.slice(-8)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // Check if user is already registered
                    const studentsData = localStorage.getItem('students');
                    if (studentsData) {
                      const students = JSON.parse(studentsData);
                      const existingStudent = students.find(s => s.walletAddress === accountAddress);
                      if (existingStudent) {
                        // User already registered, go to wallet page
                        navigate('/wallet');
                        return;
                      }
                    }
                    // New user, go to registration
                    navigate('/student-info', { state: { walletAddress: accountAddress } });
                  }}
                  className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  {(() => {
                    // Check if user is already registered for button text
                    const studentsData = localStorage.getItem('students');
                    if (studentsData) {
                      const students = JSON.parse(studentsData);
                      const existingStudent = students.find(s => s.walletAddress === accountAddress);
                      if (existingStudent) {
                        return 'View My Wallet';
                      }
                    }
                    return 'Continue to Registration';
                  })()}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-red-400 font-semibold mb-1">Connection Error</h4>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
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

        {/* Wallet Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {walletOptions.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => wallet.available && handleConnect(wallet.id)}
              className={`bg-gray-900 border ${
                selectedWallet === wallet.id
                  ? 'border-purple-500 bg-gray-800'
                  : 'border-gray-800 hover:border-gray-700'
              } rounded-xl p-6 ${wallet.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} transition-all ${wallet.available ? 'hover:transform hover:scale-105' : ''} duration-300 relative`}
            >
              {wallet.popular && (
                <div className="absolute top-4 right-4">
                  <span className="bg-linear-to-r from-purple-600 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Recommended
                  </span>
                </div>
              )}
              {!wallet.available && (
                <div className="absolute top-4 right-4">
                  <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full font-semibold">
                    Coming Soon
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-white">
                  {wallet.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{wallet.name}</h3>
                  <p className="text-gray-400 text-sm">{wallet.description}</p>
                  
                  {selectedWallet === wallet.id && isConnecting && (
                    <div className="mt-4 flex items-center gap-2 text-purple-400">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm">Connecting...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Secure Connection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We will never ask for your seed phrase or private keys. Your connection is encrypted and secure. Only connect wallets you trust and control.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Don't have a wallet?{' '}
            <a 
              href="https://perawallet.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors underline"
            >
              Learn how to create one
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ConnectPage;
