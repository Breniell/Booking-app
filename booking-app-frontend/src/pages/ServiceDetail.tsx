// src/pages/ServiceDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api.ts';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import ReviewSection from '../components/ReviewSection.tsx';
import { useAuthStore } from '../lib/store.ts';
interface ServiceData {
  id: number;
  expertId: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  videoPlatform?: string;
  imageUrl: string;
  Expert?: {
    firstName: string;
    lastName: string;
  };
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        setService(response.data);
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

// Définir l'URL de base du backend
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const imageSrc =
  service && service.imageUrl
    ? service.imageUrl.startsWith('http')
      ? service.imageUrl
      : `${backendURL}/${service.imageUrl.replace(/^\//, '')}`
    : '/assets/default-service.jpg';

console.log('Image Source:', imageSrc);


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        {service ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
            <img
              src={imageSrc}
              alt={service.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              crossOrigin="anonymous"
            />

            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {service.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {service.description}
                </p>
                <div className="flex justify-between items-center text-lg font-medium mb-6">
                  <span>Durée : {service.duration} minutes</span>
                  <span className="bg-yellow-200 text-yellow-800 p-2 border border-yellow-600 font-semibold italic">
                    {service.price.toLocaleString()} XAF
                  </span>
                </div>
                {service.videoPlatform && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Plateforme Vidéo : <span className="font-semibold">{service.videoPlatform}</span>
                  </p>
                )}
                {service.Expert ? (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Expert : <span className="font-semibold">{service.Expert.firstName} {service.Expert.lastName}</span>
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Expert : Non renseigné
                  </p>
                )}
              </div>
              <Link
                to={`/book?expertId=${service.expertId}&serviceId=${service.id}`}
                className="mt-4 inline-block bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors"
              >
                Réserver ce service
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">Service non trouvé.</p>
        )}

        {/* Section Avis et Commentaires */}
        <div className="mt-12">
            <ReviewSection serviceId={service?.id as number} currentUser={user}/>
        </div>
      </motion.main>
    </div>
  );
};

export default ServiceDetail;