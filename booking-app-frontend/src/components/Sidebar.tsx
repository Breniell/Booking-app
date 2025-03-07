// src/components/Sidebar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarDays, Briefcase, BookOpen } from 'lucide-react';
import { useAuthStore } from '../lib/store.ts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    {
      name: "Appointments",
      path: user?.role === 'expert' ? '/expert/dashboard' : '/client/dashboard',
      icon: <CalendarDays size={16} />
    },
    { name: "Services", path: "/services", icon: <Briefcase size={16} /> },
    { name: "Guide", path: "/how-it-works", icon: <BookOpen size={16} /> }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 shadow-lg z-50 p-4"
        style={{ backgroundColor: "#ffffff" }} // Fond opaque
      >
        <button
          onClick={onClose}
          className="mb-4 text-gray-700 text-sm font-semibold"
          aria-label="Close Navigation"
        >
          Close
        </button>
        <div className="mb-6">
          <Link to="/" onClick={onClose}>
          <h1 className="text-4xl font-bold text-primary mb-2">ReservEase</h1> 
          </Link>
        </div>
        <nav className="space-y-4">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              onClick={onClose}
              className={`flex items-center space-x-2 text-sm hover:text-primary transition-colors ${location.pathname === link.path ? "font-bold" : ""}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
