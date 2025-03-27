// src/layouts/DashboardLayout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';
import Footer from '../components/Footer.tsx';
import { useAuthStore } from '../lib/store.ts';

const DashboardLayout: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && !token) {
      // Si l'utilisateur n'est pas authentifié, rediriger
      navigate('/login', { replace: true });
    } else {
      setIsCheckingAuth(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state && location.state.fromMain) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen">
      {isCheckingAuth ? (
        <div className="w-full flex items-center justify-center">
          <p>Chargement…</p>
        </div>
      ) : (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col">
            <div className="p-4">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-700 focus:outline-none">
                ☰
              </button>
            </div>
            <main className="flex-grow p-4">
              <Outlet />
            </main>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
