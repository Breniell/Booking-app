import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.tsx';
import TestimonialsCarousel, { Testimonial } from '../components/TestimonialsCarousel.tsx';
import api from '../lib/api.ts';
import Categories from '../components/Categories.tsx';
import PopularServices from '../components/PopularServices.tsx';
import TrustedBy from '../components/TrustedBy.tsx';
import { fadeInUp, staggerContainer } from '../lib/motionVariants.ts';


interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  imageUrl: string;
}
const isDarkMode = false;

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        // On affiche ici les 3 premiers services
        setServices(response.data.slice(0, 3));
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };
    fetchServices();
  }, []);

  // Variants d'animation pour les transitions de section
  const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 60, damping: 20 }
    },
  };

  // Données fictives pour les témoignages
  const testimonialsData: Testimonial[] = [
    {
      id: 1,
      rating: 5,
      comment: "ReservEase a transformé ma gestion de rendez-vous : tout est simple et efficace !",
      createdAt: new Date().toISOString(),
      user: { firstName: "Kamga", lastName: "Pierre", avatar: "https://via.placeholder.com/50" }
    },
    {
      id: 2,
      rating: 4,
      comment: "L'interface intuitive m'a permis d'organiser mon planning en toute sérénité.",
      createdAt: new Date().toISOString(),
      user: { firstName: "Maffo", lastName: "Marie", avatar: "https://via.placeholder.com/50" }
    },
    {
      id: 3,
      rating: 5,
      comment: "Une expérience client remarquable, je recommande vivement ReservEase !",
      createdAt: new Date().toISOString(),
      user: { firstName: "Doe", lastName: "John", avatar: "https://via.placeholder.com/50" }
    }
  ];

  return (
    
    <div className="flex flex-col min-h-screen w-full bg-gray-100 dark:bg-gray-900 scroll-smooth">
      {/* HERO SECTION */}
      <Hero />

{/* Catégories */}
<motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Categories isDarkMode={isDarkMode} />
      </motion.div>

      {/* Trusted By */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <TrustedBy />
      </motion.div>

      {/* Popular */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <PopularServices isDarkMode={isDarkMode} />
      </motion.div>
      
      {/* SECTION À PROPOS */}
      <motion.section
        className="py-20 bg-white dark:bg-gray-800 w-full"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            À propos de ReservEase
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Notre plateforme connecte clients et experts pour simplifier la gestion de vos rendez-vous.
            Réservez, organisez et synchronisez vos rendez-vous avec une interface moderne et intuitive.
          </p>
        </div>
      </motion.section>

      {/* SECTION NOS SERVICES */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-900 w-full"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4">
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
                  : service.imageUrl || 'https://via.placeholder.com/800x600';
              return (
                <Link to={`/service/${service.id}`} key={service.id}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow cursor-pointer"
                  >
                    <img
                      src={imageSrc}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                      crossOrigin="anonymous"
                    />
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
                </Link>
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

      {/* SECTION HOW IT WORKS */}
      <motion.section
        className="py-20 bg-white dark:bg-gray-800 w-full"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 border rounded-xl hover:shadow-xl transition-shadow">
              <img src="/assets/x service.avif" alt="Étape 1" className="mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Choisissez un service</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Parcourez notre catalogue et sélectionnez le service qui vous convient.
              </p>
            </div>
            <div className="p-8 border rounded-xl hover:shadow-xl transition-shadow">
              <img src="/assets/reservation.avif" alt="Étape 2" className="mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Réservez une date</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Choisissez une date et un créneau qui vous convient dans l'agenda de l'expert.
              </p>
            </div>
            <div className="p-8 border rounded-xl hover:shadow-xl transition-shadow">
              <img src="/assets/confirmation.jpeg" alt="Étape 3" className="mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Confirmez et réservez</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Validez votre réservation et recevez une confirmation instantanée.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION PARTENAIRES */}
      <motion.section
        className="py-20 bg-gray-100 dark:bg-gray-900 w-full"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            Nos Partenaires
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              '/assets/Google_2015_logo.svg',
              '/assets/zoom.jpeg',
              '/assets/stripe.png',
              '/assets/Slack_Icon.png'
            ].map((logo, idx) => (
              <motion.img
                key={idx}
                src={logo}
                alt={`Logo partenaire ${idx + 1}`}
                className="w-32 h-auto object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION TÉMOIGNAGES */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-900 w-full"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10">
            Témoignages
          </h2>
          <TestimonialsCarousel testimonials={testimonialsData} />
        </div>
      </motion.section>

      {/* SECTION ACTUALITÉS / BLOG */}
      <motion.section
        className="py-20 bg-white dark:bg-gray-800 w-full"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">
            Dernières Actualités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Nouveautés ReservEase
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Découvrez les dernières mises à jour et fonctionnalités pour améliorer votre expérience.
              </p>
              <Link to="/blog" className="text-primary hover:underline font-medium text-xl">
                Lire l'article
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Conseils de Réservation
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Optimisez la gestion de vos rendez-vous grâce à nos conseils et astuces.
              </p>
              <Link to="/blog" className="text-primary hover:underline font-medium text-xl">
                Lire l'article
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Histoires de Succès
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Découvrez comment ReservEase a transformé le quotidien professionnel de nos utilisateurs.
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
