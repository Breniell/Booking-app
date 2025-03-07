// src/pages/CreateServicePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.ts';
import { motion } from 'framer-motion';

interface AvailabilitySlot {
  date: string;      // format "YYYY-MM-DD"
  startTime: string; // format "HH:MM"
  endTime: string;   // format "HH:MM"
  duration?: number; // calculé automatiquement en minutes
}

const CreateServicePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [videoPlatform, setVideoPlatform] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [currentSlot, setCurrentSlot] = useState<AvailabilitySlot>({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calcul de la durée dès que la date, l'heure de début et l'heure de fin sont renseignées
  useEffect(() => {
    if (currentSlot.date && currentSlot.startTime && currentSlot.endTime) {
      const start = new Date(`${currentSlot.date}T${currentSlot.startTime}`);
      const end = new Date(`${currentSlot.date}T${currentSlot.endTime}`);
      const diff = (end.getTime() - start.getTime()) / 60000;
      setCurrentSlot(prev => ({ ...prev, duration: diff > 0 ? diff : 0 }));
    }
  }, [currentSlot.date, currentSlot.startTime, currentSlot.endTime]);

  const handleAddAvailability = () => {
    if (!currentSlot.date || !currentSlot.startTime || !currentSlot.endTime) {
      setError("Veuillez renseigner la date, l'heure de début et l'heure de fin pour la disponibilité.");
      return;
    }
    if (!currentSlot.duration || currentSlot.duration <= 0) {
      setError("La durée doit être supérieure à 0.");
      return;
    }
    setAvailabilitySlots(prev => [...prev, currentSlot]);
    // Réinitialiser le créneau courant
    setCurrentSlot({ date: '', startTime: '', endTime: '' });
    setError(null);
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailabilitySlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Vérifier qu'au moins un créneau est renseigné et récupérer sa durée
    if (availabilitySlots.length === 0) {
      setError("Veuillez ajouter au moins une disponibilité.");
      setLoading(false);
      return;
    }
    const serviceDuration = availabilitySlots[0].duration;
    if (!serviceDuration || serviceDuration <= 0) {
      setError("La durée du service doit être supérieure à 0.");
      setLoading(false);
      return;
    }
    
    try {
      await api.post('/services', {
        name,
        description,
        duration: serviceDuration,  // Envoyer la durée calculée
        price,
        videoPlatform,
        imageUrl,
        availability: availabilitySlots  // Envoi des disponibilités au format attendu
      });
      navigate('/expert/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12 flex-grow"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Créer un nouveau service
        </h1>
        {error && (
          <div className="mb-4 text-center text-red-500">{error}</div>
        )}
        <form onSubmit={handleCreateService} className="max-w-lg mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg">
          {/* Informations du service */}
          <div>
            <label className="block text-gray-700 mb-2">Nom du service</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Ex: Consultation en ligne"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Décrivez le service en détail"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Prix (XAF)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Plateforme Vidéo</label>
              <select
                value={videoPlatform}
                onChange={(e) => setVideoPlatform(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                <option value="">Aucune</option>
                <option value="zoom">Zoom</option>
                <option value="googlemeet">Google Meet</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          {/* Section Disponibilités intégrée */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Disponibilités</h2>
            <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={currentSlot.date}
                    onChange={(e) => setCurrentSlot(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Début</label>
                  <input
                    type="time"
                    value={currentSlot.startTime}
                    onChange={(e) => setCurrentSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Fin</label>
                  <input
                    type="time"
                    value={currentSlot.endTime}
                    onChange={(e) => setCurrentSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {currentSlot.duration && currentSlot.duration > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Durée calculée : {currentSlot.duration} minutes
                </p>
              )}
              <button
                type="button"
                onClick={handleAddAvailability}
                className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
              >
                Ajouter cette disponibilité
              </button>
            </div>
            {availabilitySlots.length > 0 ? (
              <div className="space-y-2">
                {availabilitySlots.map((slot, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded shadow">
                    <div>
                      <span className="text-gray-700 font-medium">{slot.date}</span>
                      <span className="ml-2 text-gray-600">{slot.startTime} - {slot.endTime}</span>
                      {slot.duration && (
                        <span className="ml-2 text-sm text-gray-500">({slot.duration} min)</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAvailability(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucune disponibilité renseignée.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary-dark text-white py-3 rounded-lg transition-colors"
          >
            {loading ? "Création en cours..." : "Créer le service"}
          </button>
        </form>
      </motion.main>
    </div>
  );
};

export default CreateServicePage;
