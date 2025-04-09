import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar, FaUserCircle } from 'react-icons/fa';

export interface Testimonial {
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

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  
  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  if (total === 0) return <p>Aucun témoignage trouvé.</p>;

  const testimonial = testimonials[current];

  return (
    <div className="relative">
      <motion.div
        key={testimonial.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mx-auto max-w-2xl"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                size={16}
                className="mr-1"
                style={{ color: index < testimonial.rating ? '#FFD700' : '#d1d5db' }}
              />
            ))}
          </div>
          <div className="flex items-center ml-4">
            {testimonial.user?.avatar ? (
              <img
                src={testimonial.user.avatar}
                alt={`${testimonial.user.firstName || ''} ${testimonial.user.lastName || ''}`}
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
            )}
            <div className="text-left">
              <p className="font-bold text-gray-800">
                {testimonial.user?.firstName && testimonial.user?.lastName
                  ? `${testimonial.user.firstName} ${testimonial.user.lastName}`
                  : 'Utilisateur inconnu'}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-600 italic">"{testimonial.comment}"</p>
      </motion.div>
      <button
        onClick={prev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        aria-label="Précédent"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        aria-label="Suivant"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default TestimonialsCarousel;
