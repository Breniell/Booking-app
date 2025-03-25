// src/components/Hero.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  '/assets/pexels-tima-miroshnichenko-6693661.jpg',
  '/assets/young-african-american-man-with-beard-holding-pile-books-smiling-happy-pointing-with-hand-finger-side.jpg',
  '/assets/business-man-banner-concept-with-copy-space.jpg'
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000);
  };

  const stopSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startSlide();
    return () => stopSlide();
  }, []);

  return (
    <section
      className="relative w-screen h-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        width: '100vw',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}
      aria-label="Section d'accueil"
      onMouseEnter={stopSlide}
      onMouseLeave={startSlide}
    >
      {/* Carrousel d'images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[current]}
            alt={`Slide ${current + 1}`}
            className="w-full h-full object-cover"
            style={{ minWidth: '100vw' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay avec dégradé */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />

      {/* Boutons de navigation */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
        <button
          className="p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onClick={() => setCurrent(prev => (prev - 1 + images.length) % images.length)}
        >
          <ChevronLeft 
            size={32} 
            style={{ color: '#FFFFFF' }}
            strokeWidth={2.5}
          />
        </button>
        <button
          className="p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onClick={() => setCurrent(prev => (prev + 1) % images.length)}
        >
          <ChevronRight 
            size={32} 
            style={{ color: '#FFFFFF' }}
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Contenu centré */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl space-y-4 md:space-y-6"
        >
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{
              color: '#FFFFFF',
              textShadow: '0 4px 12px rgba(0,0,0,0.4)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Réservez vos rendez-vous
            <span 
              className="block mt-4"
              style={{
                background: 'linear-gradient(to right, #FFD700, #FFAA00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              en toute simplicité
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              fontWeight: 500
            }}
          >
            Découvrez ReservEase, la solution intuitive pour gérer vos réservations professionnelles.
          </motion.p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              to="/experts"
              className="inline-flex items-center justify-center rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
              style={{
                backgroundColor: '#5E35B1',
                color: '#FFFFFF',
                padding: '1rem 2rem',
                minWidth: '220px'
              }}
            >
              Trouver un Expert
              <ChevronRight 
                className="ml-2" 
                size={22}
                style={{ color: '#FFFFFF' }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;