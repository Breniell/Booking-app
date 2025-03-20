// src/components/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => (
  <section className="relative h-screen overflow-hidden" aria-label="Section d'accueil">
    {/* Image de fond avec bordures et coins arrondis */}
    <div className="absolute inset-0 overflow-hidden rounded-lg border-4 border-white shadow-lg">
      <img
        src="/assets/pexels-tima-miroshnichenko-6693661.jpg"
        alt="Background"
        className="object-cover w-full h-full transition-transform duration-500 ease-in-out transform scale-110"
      />
    </div>
    <div className="absolute inset-0 bg-black opacity-60 backdrop-filter backdrop-blur-md"></div> {/* Augmentation de l'opacité */}
    <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center h-full text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ color: '#FFD700' }} // Couleur du texte en style inline
        className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
      >
        Réservez vos rendez-vous en toute simplicité
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ color: '#FFFFFF' }} // Couleur du texte en style inline
        className="text-lg md:text-2xl mb-8 max-w-2xl drop-shadow-md"
      >
        Découvrez ReservEase, la plateforme complète pour gérer vos rendez-vous et trouver l'expert idéal.
      </motion.p>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Link
          to="/experts"
          className="bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors shadow-lg"
        >
          Trouver un Expert
        </Link>
      </motion.div>
    </div>
  </section>
);

export default Hero;