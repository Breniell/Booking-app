// src/pages/HowItWorks.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* <Navbar /> */}
      <motion.main 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Comment ça marche ?</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Etape 1 */}
          <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8" whileHover={{ scale: 1.02 }}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">1. Choisissez un Service</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Parcourez notre liste d'experts et sélectionnez le service qui vous correspond.
            </p>
            <img src="/assets/service-example.jpg" alt="Service" className="mt-4 rounded-lg" />
          </motion.div>
          {/* Etape 2 */}
          <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8" whileHover={{ scale: 1.02 }}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">2. Réservez votre Rendez-vous</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sélectionnez une date et un créneau horaire adapté à votre emploi du temps.
            </p>
            <img src="/assets/booking-example.jpg" alt="Booking" className="mt-4 rounded-lg" />
          </motion.div>
          {/* Etape 3 */}
          <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8" whileHover={{ scale: 1.02 }}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">3. Confirmez et Réglez</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Validez votre réservation et recevez une confirmation instantanée par email.
            </p>
            <img src="/assets/confirmation-example.jpg" alt="Confirmation" className="mt-4 rounded-lg" />
          </motion.div>
        </div>
        <div className="mt-12 text-center">
          <Link 
            to="/book/:expertId" 
            className="bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors"
          >
            Commencez à réserver
          </Link>
        </div>
      </motion.main>
      {/* <Footer /> */}
    </div>
  );
};

export default HowItWorks;
