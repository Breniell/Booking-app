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

  // Vérification d'accès (à compléter selon vos règles)
  useEffect(() => {
    if (!user || !(user.role === 'expert' || user.role === 'client')) {
      // Rediriger vers la page d'accueil ou login si l'utilisateur n'est pas autorisé
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // On évite que l'utilisateur ne revienne accidentellement sur le dashboard en cliquant "retour"
  useEffect(() => {
    if (location.state && location.state.fromMain) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        {/* Optionnel : un bouton en haut à gauche pour réactiver la sidebar si elle est fermée */}
        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 focus:outline-none"
          >
            {/* Icône de hamburger ou similaire */}
            ☰
          </button>
        </div>
        <main className="flex-grow p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
