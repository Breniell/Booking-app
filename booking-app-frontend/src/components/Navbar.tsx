// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBell, FaEnvelope, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../lib/store.ts';
import {SearchBar} from './SearchBar.tsx';

interface NavbarProps {
  onMenuClick?: () => void;
  showQuickLinks?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showQuickLinks = false }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="text-gray-700 focus:outline-none">
            {/* Icône hamburger si nécessaire */}
            <span className="text-2xl">☰</span>
          </button>
        )}
        <Link to="/" className="text-2xl font-bold" style={{ color: "#5E35B1" }}>
          ReservEase
        </Link>
        {showQuickLinks && (
          <div className="hidden md:flex space-x-6">
            <Link to="/services" className="text-gray-700 font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="/book" className="text-gray-700 font-medium hover:text-primary transition-colors">
              Appointments
            </Link>
            <Link to="/how-it-works" className="text-gray-700 font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
          </div>
        )}
      </div>
      <div className="flex-1 mx-4">
        <div className="max-w-xs mx-auto">
          <SearchBar />
        </div>
      </div>
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
          <FaUser size={20} className="text-gray-700" />
          <span className="text-gray-700 font-medium">{user?.firstName || user?.email}</span>
        </button>
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 z-50 rounded-lg shadow-lg"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <ul>
                <li>
                  <Link to="/notifications" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <FaBell className="mr-2" />
                    Notifications
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <FaEnvelope className="mr-2" />
                    Messages
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <FaCog className="mr-2" />
                    Paramètres
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <FaQuestionCircle className="mr-2" />
                    Aide
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Déconnexion
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
