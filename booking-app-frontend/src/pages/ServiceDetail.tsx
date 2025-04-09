// src/pages/ServiceDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaFilter, FaTimes } from 'react-icons/fa';
import api from '../lib/api.ts';
import ReviewSection from '../components/ReviewSection.tsx';
import { useAuthStore } from '../lib/store.ts';

// Styles personnalisés
const FilterTriggerButton = styled.button`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  }
`;

const FilterModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FilterModalContent = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const FilterTitle = styled.h3`
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
  font-weight: 500;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
`;

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

type SortCriteria = 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceData | null>(null);
  const [similarServices, setSimilarServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'price-asc' as SortCriteria,
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: ''
  });
  const { user } = useAuthStore();

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceResponse = await api.get(`/services/${id}`);
        setService(serviceResponse.data);
        
        if (serviceResponse.data?.expertId) {
          const similarResponse = await api.get(`/services/expert/${serviceResponse.data.expertId}`);
          setSimilarServices(similarResponse.data.filter((s: ServiceData) => s.id !== serviceResponse.data.id));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Filtrage des services
  const filteredServices = similarServices
    .filter(s => 
      (!filters.minPrice || s.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || s.price <= Number(filters.maxPrice)) &&
      (!filters.minDuration || s.duration >= Number(filters.minDuration)) &&
      (!filters.maxDuration || s.duration <= Number(filters.maxDuration))
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

  if (loading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bouton d'ouverture du filtre */}
      <FilterTriggerButton onClick={() => setIsFilterOpen(true)}>
        <FaFilter className="mr-2" />
        Ouvrir les filtres
      </FilterTriggerButton>

      {/* Modal de filtre */}
      <AnimatePresence>
        {isFilterOpen && (
          <FilterModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
          >
            <FilterModalContent
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FilterHeader>
                <FilterTitle>Filtrer les résultats</FilterTitle>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </FilterHeader>

              <div className="space-y-6">
                <FilterGroup>
                  <FilterLabel>Trier par</FilterLabel>
                  <FilterSelect
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                  >
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="duration-asc">Durée croissante</option>
                    <option value="duration-desc">Durée décroissante</option>
                  </FilterSelect>
                </FilterGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FilterGroup>
                    <FilterLabel>Prix minimum (XAF)</FilterLabel>
                    <FilterInput
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                    />
                  </FilterGroup>
                  <FilterGroup>
                    <FilterLabel>Prix maximum (XAF)</FilterLabel>
                    <FilterInput
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                    />
                  </FilterGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FilterGroup>
                    <FilterLabel>Durée minimum (min)</FilterLabel>
                    <FilterInput
                      type="number"
                      name="minDuration"
                      value={filters.minDuration}
                      onChange={handleFilterChange}
                    />
                  </FilterGroup>
                  <FilterGroup>
                    <FilterLabel>Durée maximum (min)</FilterLabel>
                    <FilterInput
                      type="number"
                      name="maxDuration"
                      value={filters.maxDuration}
                      onChange={handleFilterChange}
                    />
                  </FilterGroup>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </FilterModalContent>
          </FilterModalOverlay>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      {service ? (
        <div className="max-w-6xl mx-auto p-4">
          {/* Section service principal */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img
                src={service.imageUrl || '/default-service.jpg'}
                alt={service.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{service.name}</h1>
                <p className="text-gray-600">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">
                    Durée : {service.duration} min
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {service.price.toLocaleString()} XAF
                  </span>
                </div>
                <Link
                  to={`/book?expertId=${service.expertId}&serviceId=${service.id}`}
                  className="inline-block w-full text-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Réserver maintenant
                </Link>
              </div>
            </div>
          </div>

          {/* Avis */}
          <ReviewSection serviceId={service.id} currentUser={user} />

          {/* Services similaires */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Services similaires</h2>
            
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <Link 
                    key={service.id} 
                    to={`/service/${service.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {service.description.substring(0, 80)}...
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          {service.price.toLocaleString()} XAF
                        </span>
                        <span className="text-sm text-gray-500">
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun service trouvé avec ces critères
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-red-500">
          Service introuvable
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;