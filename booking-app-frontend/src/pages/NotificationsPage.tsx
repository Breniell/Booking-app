// src/pages/NotificationsPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api.ts';

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Remplacez cette URL par l'endpoint réel de notifications
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des notifications…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-600">Aucune notification.</p>
      ) : (
        notifications.map(n => (
          <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b py-4">
            <h2 className="font-semibold text-lg">{n.title}</h2>
            <p className="text-gray-700">{n.message}</p>
            <span className="text-gray-500 text-sm">{new Date(n.createdAt).toLocaleString()}</span>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
