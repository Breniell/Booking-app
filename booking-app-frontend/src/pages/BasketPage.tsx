// src/pages/BasketPage.tsx
import React from 'react';
import { useBasketStore } from '../lib/basketStore.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const BasketPage: React.FC = () => {
  const { items, removeItem, clearBasket, total } = useBasketStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Ici, vous intégreriez votre module de paiement.
    // Pour cet exemple, nous simulons le paiement, puis nous créons des rendez-vous multiples via l'API.
    const basket = items;
    // Appel API pour créer les rendez-vous groupés (utilisation de createMultiAppointment)
    fetch('http://localhost:5000/api/appointments/multi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ basket }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Après paiement réussi, vider le panier et rediriger vers la page de confirmation
        clearBasket();
        navigate('/booking-confirmation');
      })
      .catch((err) => {
        console.error('Erreur lors du paiement:', err);
        alert('Erreur lors du paiement. Veuillez réessayer.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Mon Panier</h1>
        {items.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300">
            Votre panier est vide. <Link to="/" className="text-blue-600 hover:underline">Retour aux services</Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col md:flex-row items-center justify-between py-4"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {item.service.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.date} à {item.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                      <span className="text-lg text-blue-600 font-medium">
                        {item.service.price.toLocaleString()} XAF
                      </span>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between">
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Total : {total().toLocaleString()} XAF
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <button
                  onClick={clearBasket}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                >
                  Vider le panier
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Passer au paiement
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
