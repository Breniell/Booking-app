// src/pages/ThirdPartyServices.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';

export function ThirdPartyServices() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-2xl font-bold mb-6">Intégrations de Services Tiers</h1>
        <p className="text-gray-700 mb-8">
          Connectez vos services préférés pour améliorer votre expérience ReservEase.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-4 mb-2">
              <Mail size={32} className="text-blue-500" />
              <h2 className="text-xl font-semibold">Vidéo Consultation</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Planifiez et lancez des consultations vidéo directement depuis ReservEase.
            </p>
            <Link to="/video-integration" className="text-blue-600 hover:underline">
              Configurer la vidéo
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-4 mb-2">
              <Mail size={32} className="text-red-500" />
              <h2 className="text-xl font-semibold">Google Meet</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Utilisez Google Meet pour des réunions en ligne fluides et efficaces.
            </p>
            <Link to="/google-meet-integration" className="text-red-600 hover:underline">
              Configurer Google Meet
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-4 mb-2">
              <Mail size={32} className="text-yellow-500" />
              <h2 className="text-xl font-semibold">Email</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Configurez les notifications par e-mail pour les réservations, rappels, etc.
            </p>
            <Link to="/email-settings" className="text-yellow-600 hover:underline">
              Configurer l'Email
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-4 mb-2">
              <MessageSquare size={32} className="text-green-500" />
              <h2 className="text-xl font-semibold">SMS Notifications</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Recevez des notifications SMS instantanées pour les nouveaux rendez-vous.
            </p>
            <Link to="/sms-settings" className="text-green-600 hover:underline">
              Configurer SMS
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
