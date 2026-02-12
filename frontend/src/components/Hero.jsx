import React from 'react';

const Hero = () => {
  return (
    <section className="bg-black text-white min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 flex items-center min-h-[calc(100vh-80px)]">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full mb-8 border border-gray-800">
            <span className="text-sm text-gray-300">Secure Identity Verification Platform</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Get warm leads for your business in minutes.
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Our AI-powered platform identifies and qualifies potential customers, so you can focus on closing deals instead of chasing cold leads.
          </p>

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
  );
};

export default Hero;
