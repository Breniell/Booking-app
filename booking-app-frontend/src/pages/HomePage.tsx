// src/pages/HomePage.tsx
// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import Hero from '../components/Hero.tsx';
import api from '../lib/api.ts';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data.slice(0, 3));
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      <Hero />

      {/* Section À propos */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="py-20 bg-white dark:bg-gray-800 w-full"
      >
        <div className="w-full px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            À propos de ReservEase
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            ReservEase met en relation des clients et des experts pour simplifier la gestion de vos rendez-vous.
            Notre plateforme vous permet de réserver, gérer et synchroniser vos rendez-vous en toute simplicité.
          </p>
        </div>
      </motion.section>

      {/* Section Nos Services */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="py-20 bg-gray-50 dark:bg-gray-900 w-full"
      >
        <div className="w-full px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service) => {
              const imageSrc =
                service.imageUrl &&
                !service.imageUrl.startsWith('http') &&
                !service.imageUrl.startsWith('/assets')
                  ? `${backendURL}/${service.imageUrl.replace(/^\//, '')}`
                  : service.imageUrl || '/assets/default-service.jpg';

              return (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow"
                >
                  <img src={imageSrc} alt={service.name} className="w-full h-48 object-cover rounded-lg shadow-md" crossOrigin="anonymous" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {service.name}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-lg text-gray-500">
                    <span>{service.duration} minutes</span>
                    <span className="text-primary font-medium">
                      {service.price.toLocaleString()} XAF
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link to="/services" className="text-primary hover:underline font-semibold text-xl">
              Voir tous nos services →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Section Fonctionnalités */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10">Fonctionnalités Clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 border rounded-xl hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Gestion Intégrée
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Gérez vos rendez-vous, services et notifications depuis une interface unique.
              </p>
            </div>
            <div className="p-8 border rounded-xl hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Synchronisation Automatique
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Synchronisez votre agenda avec Google Calendar, Outlook et autres outils.
              </p>
            </div>
            <div className="p-8 border rounded-xl hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Notifications & Paiements
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Recevez des rappels automatiques et effectuez vos paiements en toute sécurité.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Témoignages */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="py-20 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10">Témoignages</h2>
          <div className="space-y-10">
            <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-10" whileHover={{ scale: 1.02 }}>
              <p className="text-xl text-gray-600 dark:text-gray-300 italic mb-6">
                "ReservEase a transformé ma gestion de rendez-vous : tout est simple et efficace !"
              </p>
              <p className="text-2xl text-gray-800 dark:text-gray-100 font-semibold">
                – Kamga Pierre, Client
              </p>
            </motion.div>
            <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-10" whileHover={{ scale: 1.02 }}>
              <p className="text-xl text-gray-600 dark:text-gray-300 italic mb-6">
                "L'interface intuitive m'a permis d'organiser mon planning en toute sérénité."
              </p>
              <p className="text-2xl text-gray-800 dark:text-gray-100 font-semibold">
                – Maffo Marie, Expert
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section Actualités / Blog */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">Dernières Actualités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Nouveautés ReservEase</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Découvrez les dernières mises à jour et fonctionnalités ajoutées pour améliorer votre expérience.
              </p>
              <Link to="/blog" className="text-primary hover:underline font-medium text-xl">
                Lire l'article
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Conseils de Réservation</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Optimisez la gestion de vos rendez-vous grâce à nos conseils pratiques et astuces.
              </p>
              <Link to="/blog" className="text-primary hover:underline font-medium text-xl">
                Lire l'article
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Histoires de Succès</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Lisez comment ReservEase a aidé nos utilisateurs à transformer leur quotidien professionnel.
              </p>
              <Link to="/blog" className="text-primary hover:underline font-medium text-xl">
                Lire l'article
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;