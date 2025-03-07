// src/pages/Services.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../lib/api.ts';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  videoPlatform?: string;
  imageUrl: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des services...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
    
      <motion.main 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Nos Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {service.name}
              </h2>
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full max-h-96 object-cover rounded-md mb-6"
              />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {service.description}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{service.duration} minutes</span>
                <span className="text-primary font-medium">
                  {service.price.toLocaleString()} XAF
                </span>
              </div>
              <div className="mt-4 text-center">
                <Link 
                  to={`/service/${service.id}`}
                  className="text-primary hover:underline font-semibold"
                >
                  Voir détails →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>
  
    </div>
  );
};

export default Services;
