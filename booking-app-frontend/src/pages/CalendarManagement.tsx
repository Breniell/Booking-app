// src/pages/CalendarManagement.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, Save, Loader } from 'lucide-react';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';
import api from '../lib/api.ts';
import { useAuthStore } from '../lib/store.ts';

interface Availability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
}

export function CalendarManagement() {
  const { user } = useAuthStore();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<Omit<Availability, 'id'>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    recurring: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        if (user) {
          // Appeler l'endpoint avec l'ID de l'expert
          const response = await api.get(`/availabilities/${user.id}`);
          setAvailabilities(response.data);
        } 
      } catch (error) {
        console.error('Error fetching availabilities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailabilities();
  }, [user]);

  const handleSave = async () => {
    try {
      await api.put('/availabilities', availabilities);
      // Afficher un message de succès si nécessaire
    } catch (error) {
      console.error('Error saving availabilities:', error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des Disponibilités</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter un créneau
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Save size={20} />
            Sauvegarder
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <CalendarGrid
          availabilities={availabilities}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onDelete={(id) => setAvailabilities(prev => prev.filter(a => a.id !== id))}
        />
      </div>
      <AnimatePresence>
        {modalOpen && (
          <AddSlotModal
            newSlot={newSlot}
            onClose={() => setModalOpen(false)}
            onChange={setNewSlot}
            onAdd={() => {
              setAvailabilities(prev => [...prev, { ...newSlot, id: Date.now().toString() }]);
              setModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const CalendarGrid = ({ availabilities, selectedDate, onDateSelect, onDelete }: {
  availabilities: Availability[],
  selectedDate: Date,
  onDateSelect: (date: Date) => void,
  onDelete: (id: string) => void
}) => {
  const startDate = startOfWeek(selectedDate, { locale: fr });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((date) => {
        const dayAvailabilities = availabilities.filter(a => isSameDay(parseISO(a.date), date));
        return (
          <div
            key={date.toISOString()}
            className={`p-4 rounded-lg border ${isSameDay(date, new Date()) ? 'bg-blue-50' : 'bg-white'}`}
          >
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500">
                {format(date, 'EEE', { locale: fr })}
              </div>
              <div className="text-lg font-semibold">
                {format(date, 'd')}
              </div>
            </div>
            {dayAvailabilities.map(availability => (
              <motion.div
                key={availability.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-100 p-2 rounded-md mb-2 text-sm relative group"
              >
                <div className="flex justify-between items-center">
                  <span>
                    {availability.startTime} - {availability.endTime}
                  </span>
                  <button
                    onClick={() => onDelete(availability.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {availability.recurring && (
                  <div className="text-xs text-green-600 mt-1">Récurrent</div>
                )}
              </motion.div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const AddSlotModal = ({ newSlot, onClose, onChange, onAdd }: {
  newSlot: Omit<Availability, 'id'>,
  onClose: () => void,
  onChange: (slot: Omit<Availability, 'id'>) => void,
  onAdd: () => void
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
  >
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Ajouter un créneau</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={newSlot.date}
            onChange={(e) => onChange({ ...newSlot, date: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Début</label>
            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) => onChange({ ...newSlot, startTime: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fin</label>
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) => onChange({ ...newSlot, endTime: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newSlot.recurring}
            onChange={(e) => onChange({ ...newSlot, recurring: e.target.checked })}
            className="h-4 w-4"
          />
          <label className="text-sm">Rendre récurrent</label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          Annuler
        </button>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Ajouter
        </button>
      </div>
    </div>
  </motion.div>
);


