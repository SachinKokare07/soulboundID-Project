import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-black text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-semibold">Pluto</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/view-students')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            View Students
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            Setting
          </button>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-4">
          <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors border border-gray-700">
            Verifier
          </button>
          <button 
            onClick={() => navigate('/wallet')}
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
