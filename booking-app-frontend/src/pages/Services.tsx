// src/pages/Services.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFilter, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import api from '../lib/api.ts';

const FloatingFilterButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

const FilterModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  z-index: 1001;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  videoPlatform?: string;
  imageUrl: string;
}

type SortCriteria = 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'price-asc' as SortCriteria,
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: ''
  });

  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetFilters = () => {
    setFilters({
      sort: 'price-asc',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: ''
    });
  };

  const filteredServices = services
    .filter(service => 
      (!filters.minPrice || service.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || service.price <= Number(filters.maxPrice)) &&
      (!filters.minDuration || service.duration >= Number(filters.minDuration)) &&
      (!filters.maxDuration || service.duration <= Number(filters.maxDuration))
    )
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'duration-asc': return a.duration - b.duration;
        case 'duration-desc': return b.duration - a.duration;
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des services...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <FloatingFilterButton onClick={() => setIsFilterOpen(true)}>
        <FaFilter />
        Filtrer les services
      </FloatingFilterButton>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-1000"
              onClick={() => setIsFilterOpen(false)}
            />
            
            <FilterModal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filtres et tri</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">Trier par</label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="duration-asc">Durée croissante</option>
                    <option value="duration-desc">Durée décroissante</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Prix min (XAF)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Prix max (XAF)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Durée min (min)</label>
                    <input
                      type="number"
                      name="minDuration"
                      value={filters.minDuration}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Durée max (min)</label>
                    <input
                      type="number"
                      name="maxDuration"
                      value={filters.maxDuration}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </FilterModal>
          </>
        )}
      </AnimatePresence>

      <motion.main 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Nos Services
        </h1>
        
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const imageSrc = service.imageUrl?.startsWith('http') 
                ? service.imageUrl 
                : `${backendURL}/${service.imageUrl}`;

              return (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {service.name}
                  </h2>
                  <img
                    src={imageSrc}
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{service.duration} minutes</span>
                    <span className="text-blue-600 font-medium">
                      {service.price.toLocaleString()} XAF
                    </span>
                  </div>
                  <div className="mt-4 text-center">
                    <Link 
                      to={`/service/${service.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600 dark:text-gray-300">
            Aucun service trouvé avec ces critères
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default Services;