import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

const BookingConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* <Navbar /> */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center"
      >
        <CheckCircle className="text-primary mb-6" size={64} />
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Votre rendez-vous est confirmé !
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
          Merci de votre confiance. Un email de confirmation vous a été envoyé avec tous les détails de votre rendez-vous.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link 
            to="/client/dashboard" 
            className="bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors"
          >
            Voir mon Dashboard
          </Link>
          <Link 
            to="/" 
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </motion.main>
      {/* <Footer /> */}
    </div>
  );
};

export default BookingConfirmation;
