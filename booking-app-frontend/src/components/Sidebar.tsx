// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Home, CalendarDays, Briefcase, BookOpen, X } from 'lucide-react';
import { useAuthStore } from '../lib/store.ts';

// Définition de composants stylisés
const SidebarWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 16rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
  background: linear-gradient(to bottom, #ffffff, #e5e7eb) !important;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
`;

const CloseButton = styled(motion.button)`
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled(motion.div)`
  border-radius: 0.375rem;
`;

const NavLinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  text-decoration: none;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  color: #374151;
  
  &.active {
    font-weight: bold;
    color: #3b82f6;
  }
  
  &:hover {
    color: #3b82f6;
    background-color: #f3f4f6;
  }
`;

// Variants pour l'animation des éléments de navigation
const navItemVariants = {
  rest: { scale: 1, backgroundColor: "transparent" },
  hover: { scale: 1.05, backgroundColor: "#f3f4f6" },
};

const navLinks = (role: string | undefined) => [
  { name: "Home", path: "/", icon: <Home size={18} /> },
  {
    name: "Appointments",
    path: role === 'expert' ? '/expert/dashboard' : '/client/dashboard',
    icon: <CalendarDays size={18} />
  },
  { name: "Services", path: "/services", icon: <Briefcase size={18} /> },
  { name: "Guide", path: "/how-it-works", icon: <BookOpen size={18} /> }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <>
      {isOpen && <Overlay onClick={onClose} />}
      <SidebarWrapper
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        {/* Bouton de fermeture animé */}
        <CloseButton
          onClick={onClose}
          whileHover={{ scale: 1.2, rotate: 90 }}
          transition={{ type: 'spring', stiffness: 300 }}
          aria-label="Fermer le menu"
        >
          <X size={24} style={{ color: "#374151" }} />
        </CloseButton>

        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" onClick={onClose}>
            <Title>ReservEase</Title>
          </Link>
        </div>
        <NavContainer>
          {navLinks(user?.role).map(link => (
            <NavItem
              key={link.name}
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={navItemVariants}
            >
              <NavLinkStyled
                to={link.path}
                onClick={onClose}
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavContainer>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
