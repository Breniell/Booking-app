// src/pages/VideoConferencePage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api.ts';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

type Provider = 'zoom' | 'googlemeet';

const VideoConferencePage: React.FC = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider>('zoom');
  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateMeeting = async () => {
    setError(null);
    setLoading(true);
    try {
      const endpoint = provider === 'zoom' ? '/video/zoom' : '/video/googlemeet';
      const payload = provider === 'zoom'
        ? { topic, start_time: startTime }
        : { summary: topic, startTime, endTime: startTime }; // Adaptez selon votre backend
      const response = await api.post(endpoint, payload);
      setMeetingUrl(response.data.joinUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la réunion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Créer une Réunion Vidéo
        </h1>
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Choisissez le fournisseur</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="zoom" 
                  checked={provider === 'zoom'} 
                  onChange={() => setProvider('zoom')} 
                  className="form-radio text-primary"
                />
                <span className="ml-2">Zoom</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="googlemeet" 
                  checked={provider === 'googlemeet'} 
                  onChange={() => setProvider('googlemeet')} 
                  className="form-radio text-primary"
                />
                <span className="ml-2">Google Meet</span>
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="topic" className="block text-gray-700 dark:text-gray-300 mb-2">Sujet de la Réunion</label>
            <input 
              type="text" 
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex : Consultation en ligne"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="startTime" className="block text-gray-700 dark:text-gray-300 mb-2">Date et Heure</label>
            <input 
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          {error && <div className="mb-4 text-center text-red-500">{error}</div>}
          {meetingUrl && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-lg">
              Réunion créée ! <br />
              <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Cliquez ici pour rejoindre
              </a>
            </div>
          )}
          <button 
            onClick={handleCreateMeeting}
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary-dark text-white py-3 rounded-lg transition-colors"
          >
            {loading ? 'Création en cours...' : 'Créer Réunion'}
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Vous pouvez également consulter notre <Link to="/booking" className="text-primary hover:underline font-semibold">système de réservation</Link> pour planifier vos rendez-vous.
          </p>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default VideoConferencePage;
