// src/components/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/* 
  Références : Now UI Dashboard React, Argon Dashboard React, etc.
  Design aéré avec animation pour un impact visuel fort.
*/

const Hero: React.FC = () => (
  <section
    className="relative bg-cover bg-center h-screen"
    style={{ backgroundImage: "url('/assets/hero-background.jpg')" }}
    aria-label="Section d'accueil"
  >
    <div className="absolute inset-0 bg-black opacity-60"></div>
    <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center h-full text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-white mb-4"
      >
        Réservez vos rendez-vous en toute simplicité
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl"
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
          className="bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors"
        >
          Trouver un Expert
        </Link>
      </motion.div>
    </div>
  </section>
);

export default Hero;
