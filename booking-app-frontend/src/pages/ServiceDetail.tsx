import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api.ts';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import ReviewSection from '../components/ReviewSection.tsx';

interface ServiceData {
  id: number;
  expertId: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  videoPlatform?: string;
  imageUrl: string;
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        setService(response.data);
        console.log(service);
      } catch (error) {
        console.error('Erreur lors de la récupération du service:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement du service...
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
        {service ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {service.name}
            </h1>
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full max-h-96 object-cover rounded-md mb-6"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
            <div className="flex justify-between items-center text-lg font-medium text-gray-800 dark:text-gray-100 mb-6">
              <span>Durée: {service.duration} minutes</span>
              <span className="text-yellow-800 bg-yellow-200 p-2 border-yellow-600 font-semibold italic">
                Prix: {service.price.toLocaleString()} XAF
              </span>

            </div>
            {service.videoPlatform && (
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Plateforme Vidéo: <span className="font-semibold">{service.videoPlatform}</span>
                </p>
              </div>
            )}
            {service.Expert && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Expert: <span className="font-semibold">{service.Expert.firstName} {service.Expert.lastName}</span>
              </p>
            )}
            <Link 
              to={`/book?expertId=${service.expertId}&serviceId=${service.id}`}
              className="inline-block bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors"
            >
              Réserver ce service
            </Link>

          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">Service non trouvé.</p>
        )}
        {service && <ReviewSection serviceId={service.id} />}
      </motion.main>
    </div>
  );
};

export default ServiceDetail;
