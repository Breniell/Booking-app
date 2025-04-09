// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserCircle,
  FaRegBell,
  FaSlidersH,
  FaLifeRing,
  FaSignOutAlt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../lib/store.ts';
import { SearchBar } from './SearchBar.tsx';
import { ShoppingCart } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
  showQuickLinks?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showQuickLinks = false }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToDashboard = () => {
    if (user) {
      navigate(user.role === 'expert' ? '/expert/dashboard' : '/client/dashboard');
    }
  };

  const goToProfile = () => {
    if (user) {
      navigate(user.role === 'expert' ? '/expert/profile' : '/client/profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige vers la HomePage pour afficher l'interface déconnectée.
  };

  return (
    <nav
      className="bg-white shadow-md px-4 py-2 flex items-center justify-between"
      style={{ position: 'relative', zIndex: 100 }}
    >
      <div className="flex items-center space-x-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="text-gray-700 focus:outline-none">
            <span className="text-2xl">☰</span>
          </button>
        )}
        <Link to="/" className="text-2xl font-bold">
          <span style={{ color: '#0052cc' }}>ReservEase</span>
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
      <div className="flex items-center space-x-4" ref={dropdownRef}>
        <Link to="/basket" className="text-gray-700 hover:text-primary transition-colors">
          <ShoppingCart size={24} />
        </Link>
        {user ? (
          <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
            <FaUserCircle size={20} style={{ color: '#0052cc' }} />
            <span style={{ color: '#0052cc', fontWeight: 500 }}>
              {user.firstName || user.email}
            </span>
          </button>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-gray-700 font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 font-medium hover:text-primary transition-colors">
              Register
            </Link>
          </div>
        )}
        <AnimatePresence>
          {dropdownOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full mt-2 w-56 z-50 rounded-lg shadow-lg"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <ul>
                <li>
                  <button onClick={goToDashboard} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={goToProfile} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FaUserCircle className="mr-2" /> Profil
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/notifications')} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FaRegBell className="mr-2" /> Notifications
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/settings')} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FaSlidersH className="mr-2" /> Paramètres
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/help')} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FaLifeRing className="mr-2" /> Aide
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100">
                    <FaSignOutAlt className="mr-2" /> Déconnexion
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
