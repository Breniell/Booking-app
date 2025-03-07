// src/components/ReviewSection.tsx
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../lib/api.ts';

/* 
  Références : Paper Dashboard React, Fuse React Dashboard, etc.
  Composant optimisé pour la lisibilité et la fluidité des animations.
*/

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface ReviewSectionProps {
  serviceId: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ serviceId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/services/${serviceId}/reviews`);
      setReviews(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des avis', err);
    }
  };

  useEffect(() => {
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
      setReviews([...reviews, response.data.review]);
      setNewRating(0);
      setNewComment('');
    } catch (err) {
      console.error('Erreur lors de l’envoi de l’avis', err);
      setError('Erreur lors de l’envoi de votre avis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Avis des clients</h2>
      <div className="space-y-6">
        {reviews.map(review => (
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
                    className={`mr-1 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                {review.user.firstName} {review.user.lastName}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-200">{review.comment}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Laisser votre avis</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <span className="mr-3 font-medium text-gray-700">Votre note :</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
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
                      className={`cursor-pointer transition-colors duration-200 ${
                        starValue <= (hoverRating || newRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-colors"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer mon avis'}
          </button>
          {error && <p className="mt-3 text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
