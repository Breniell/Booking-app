import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../lib/api.ts';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  } | null;
}

interface ReviewSectionProps {
  serviceId: number;
  currentUser?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

const REVIEWS_PER_PAGE = 3;

const ReviewSection: React.FC<ReviewSectionProps> = ({ serviceId, currentUser }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/services/${serviceId}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des avis', err);
      }
    };
    fetchReviews();
  }, [serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || newComment.trim() === '') return;
    try {
      setLoading(true);
      const response = await api.post(`/services/${serviceId}/reviews`, {
        rating: newRating,
        comment: newComment.trim()
      });
      // Utilise la réponse du backend si disponible, sinon le currentUser
      const newReview: Review = {
        ...response.data.review,
        user: response.data.review.user || currentUser || { firstName: 'Utilisateur', lastName: 'Inconnu' }
      };
      setReviews(prev => [newReview, ...prev]);
      setNewRating(0);
      setNewComment('');
    } catch (err) {
      console.error('Erreur lors de l’envoi de l’avis', err);
      setError('Erreur lors de l’envoi de votre avis.');
    } finally {
      setLoading(false);
    }
  };

  const visibleReviews = reviews.slice(0, page * REVIEWS_PER_PAGE);
  const canLoadMore = reviews.length > visibleReviews.length;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Avis des clients</h2>

      <div className="space-y-6">
        {visibleReviews.map(review => (
          <motion.div
            key={review.id}
            className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FaStar
                    key={index}
                    size={16}
                    className="mr-1"
                    style={{
                      color: index < review.rating ? '#FFD700' : '#d1d5db'
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center ml-4">
                {review.user?.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={`${review.user.firstName || ''} ${review.user.lastName || ''}`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
                )}
                <div>
                  <p className="font-bold text-gray-800">
                    {review.user?.firstName && review.user?.lastName
                      ? `${review.user.firstName} ${review.user.lastName}`
                      : 'Utilisateur inconnu'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-200">{review.comment}</p>
          </motion.div>
        ))}
      </div>

      {canLoadMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-full transition-colors"
          >
            Voir plus
          </button>
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Laisser votre avis</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <span className="mr-3 font-medium text-gray-700">Votre note :</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= (hoverRating || newRating);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setNewRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Donner ${starValue} étoiles`}
                  >
                    <FaStar
                      size={24}
                      style={{ color: isActive ? '#FFD700' : '#d1d5db' }}
                      className="cursor-pointer transition-colors duration-200"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Votre commentaire..."
            className="w-full p-4 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            rows={4}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97706')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F59E0B')}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </button>
          </div>
          {error && <p className="mt-3 text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
