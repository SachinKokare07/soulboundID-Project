import React from 'react';

const Hero = () => {
  return (
    <>
    <section className="bg-black text-white min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 flex items-center min-h-[calc(100vh-80px)]">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full mb-8 border border-gray-800">
            <span className="text-sm text-gray-300">🔐 AI-Powered Blockchain Identity Platform</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Secure Student Identity Verification
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 mb-6 leading-relaxed">
            Verify students securely using AI and issue tamper-proof digital IDs on the blockchain. 
            <span className="text-white font-semibold"> Eliminate fraud, automate verification, and give students full ownership of their identity.</span>
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-white">AI Verification</h3>
              </div>
              <p className="text-sm text-gray-400">Facial recognition and document validation</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-white">Tamper-Proof</h3>
              </div>
              <p className="text-sm text-gray-400">Blockchain-secured credentials</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-white">Full Ownership</h3>
              </div>
              <p className="text-sm text-gray-400">Students control their own data</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors border border-gray-800">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Gradient Element */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2">
          <div className="absolute right-0 top-0 w-full h-full">
            <div className="absolute right-0 top-0 w-200 h-200 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 opacity-80 blur-3xl transform rotate-45 translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </section>

    {/* Benefits Section */}
    <section className="bg-gray-950 text-white py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose SoulboundID?</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The next-generation identity verification system built for educational institutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Eliminate Fraud */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-purple-600 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Eliminate Fraud</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              AI-powered facial recognition compares live selfies with uploaded documents to prevent identity theft and fake credentials.
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Real-time face verification</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Document authenticity checks</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Immutable blockchain records</span>
              </li>
            </ul>
          </div>

          {/* Automate Verification */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-pink-600 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Automate Verification</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Reduce manual verification from days to minutes with AI automation, saving time and reducing administrative overhead.
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Instant AI-powered analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24/7 automated processing</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Scale to thousands of students</span>
              </li>
            </ul>
          </div>

          {/* Full Ownership */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-orange-600 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Full Ownership</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Students own and control their digital identity credentials through a secure blockchain wallet with complete privacy.
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Self-sovereign identity</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Portable across platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Privacy-first architecture</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section className="bg-black text-white py-20 relative overflow-hidden">
      <div className="absolute left-0 top-1/2 w-96 h-96 bg-purple-600 opacity-20 blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Simple, secure, and seamless verification process in three steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-600 rounded-xl p-8 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 mt-4">Connect Wallet</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Students connect their Algorand-based Pera Wallet to create a blockchain identity.
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Secure blockchain authentication</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-pink-600 rounded-xl p-8 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 mt-4">AI Verification</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Upload student ID and take a live selfie. Our AI instantly verifies identity authenticity.
              </p>
              <div className="flex items-center gap-2 text-sm text-pink-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Facial recognition technology</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-600 rounded-xl p-8 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 mt-4">Get Digital ID</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Receive a tamper-proof digital credential stored on the blockchain—yours forever.
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Immutable & verifiable credentials</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Technology Stack Section */}
    <section className="bg-gray-950 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Built on Cutting-Edge Technology</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Combining AI, blockchain, and modern web technologies for unparalleled security
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Algorand Blockchain</h3>
                <p className="text-gray-400">High-speed, secure, and eco-friendly</p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">▸</span>
                <span>Instant transaction finality (4.5 seconds)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">▸</span>
                <span>Carbon-negative proof-of-stake consensus</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">▸</span>
                <span>Military-grade encryption and security</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">▸</span>
                <span>Fraction of a cent transaction costs</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">AI Face Recognition</h3>
                <p className="text-gray-400">State-of-the-art verification</p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">▸</span>
                <span>Advanced facial recognition algorithms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">▸</span>
                <span>Liveness detection to prevent spoofing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">▸</span>
                <span>99%+ accuracy in identity matching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">▸</span>
                <span>Real-time photo comparison and validation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
