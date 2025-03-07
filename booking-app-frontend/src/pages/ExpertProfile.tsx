// src/pages/ExpertProfile.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

interface ExpertProfileData {
  id: number;
  userId: number;
  bio: string;
  expertise: string;
  User: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

const ExpertProfile: React.FC = () => {
  const { userId } = useParams();
  const [expert, setExpert] = useState<ExpertProfileData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpertAndServices = async () => {
      try {
        const expertResponse = await axios.get(`/api/experts/${userId}`);
        setExpert(expertResponse.data);
        const servicesResponse = await axios.get(`/api/services/expert/${userId}`);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil expert:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpertAndServices();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement du profil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        {expert ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {expert.User.firstName} {expert.User.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Email :</strong> {expert.User.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Expertise :</strong> {expert.expertise}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Biographie :</strong> {expert.bio}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Services Proposés
              </h2>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map(service => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {service.description}
                      </p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{service.duration} minutes</span>
                        <span className="text-primary font-medium">
                          {service.price.toLocaleString()} XAF
                        </span>
                      </div>
                      <Link 
                        to={`/book/${service.expertId}?serviceId=${service.id}`}
                        className="mt-4 inline-block bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded transition-colors"
                      >
                        Réserver ce service
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Aucun service n'est actuellement proposé.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">Expert non trouvé.</p>
        )}
      </motion.main>
      <Footer />
    </div>
  );
};

export default ExpertProfile;
