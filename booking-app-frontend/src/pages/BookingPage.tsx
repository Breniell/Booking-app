// src/pages/BookingPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Loader, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
  isSameDay,
  parseISO
} from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { useAuthStore } from '../lib/store.ts';
import api from '../lib/api.ts';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface Availability {
  date: string; // Format ISO, ex. "2025-10-15T00:00:00.000Z"
  slots: string[];
}

/** ProgressIndicator **/
const ProgressIndicator = ({ step }: { step: number }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
    <div className="flex items-center gap-4">
      {[1, 2, 3].map(num => (
        <div key={num} className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              num <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {num < step ? <CheckCircle size={18} /> : num}
          </div>
          {num < 3 && <div className="h-px w-8 bg-gray-300" />}
        </div>
      ))}
    </div>
  </motion.div>
);

/** Étape 1 : Sélection du service **/
const ServiceSelection = ({ services, onSelect }: { services: Service[]; onSelect: (service: Service) => void; }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {services.map(service => (
      <motion.div
        key={service.id}
        whileHover={{ scale: 1.03 }}
        onClick={() => onSelect(service)}
        className="p-6 border rounded-xl cursor-pointer transition-all hover:border-blue-600 hover:shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{service.duration} minutes</span>
          <span className="text-blue-600 font-medium">{service.price.toLocaleString()} XAF</span>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

/** Étape 2 : Sélection de la date et de l'heure via calendrier **/
const DateTimeSelection = ({
  availabilities,
  selectedDate,
  onDateChange,
  onTimeSelect,
  setError // Ajout de setError ici
}: {
  availabilities: Availability[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  setError: (error: string | null) => void; // Type pour setError
}) => {
  const currentMonth = new Date();
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const goToPreviousMonth = () => onDateChange(subMonths(selectedDate, 1));
  const goToNextMonth = () => onDateChange(addMonths(selectedDate, 1));

  // Récupérer les disponibilités pour la date sélectionnée
  const availabilityForDay = availabilities.find(a =>
    isSameDay(parseISO(a.date), selectedDate)
  );

  // Si aucune disponibilité n’est renvoyée, on peut définir un créneau par défaut
  const defaultSlots = availabilityForDay?.slots.length
    ? availabilityForDay.slots
    : ["09:00", "10:00"]; // Créneau par défaut

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      {/* Navigation du mois */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPreviousMonth} className="p-2 rounded hover:bg-gray-200">
          <ArrowLeft size={18} />
        </button>
        <div className="font-bold text-lg text-gray-800">
          {format(selectedDate, 'MMMM yyyy', { locale: fr })}
        </div>
        <button onClick={goToNextMonth} className="p-2 rounded hover:bg-gray-200">
          <ArrowRight size={18} />
        </button>
      </div>
      {/* Calendrier */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium text-gray-700">
            {day}
          </div>
        ))}
        {eachDayOfInterval({ start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) }).map((day, idx) => {
          const isoDay = day.toISOString().split('T')[0];
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => onDateChange(day)}
              className={`py-2 rounded text-center transition-colors ${
                isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
      {/* Affichage des créneaux pour la date sélectionnée */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {defaultSlots.map(slot => (
            <button
              key={slot}
              onClick={() => {
                // Remplacez ceci par votre logique de créneau actuel
                const currentSlot = { date: selectedDate.toISOString(), startTime: slot, endTime: slot }; // Exemple de définition
                const start = new Date(`${currentSlot.date}T${currentSlot.startTime}`);
                const end = new Date(`${currentSlot.date}T${currentSlot.endTime}`);
                if (start >= end) {
                  setError("L'heure de fin doit être après l'heure de début.");
                  return;
                }
                onTimeSelect(slot);
              }}
              className="p-3 rounded-lg bg-white border hover:border-blue-600 transition-colors min-w-[100px]"
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/** Étape 3 : Confirmation **/
const ConfirmationStep = ({
  service,
  date,
  time,
  onConfirm
}: {
  service: Service;
  date: Date;
  time: string | null;
  onConfirm: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    className="text-center"
  >
    <CheckCircle className="mx-auto text-blue-600 mb-6" size={48} />
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Résumé de votre réservation</h2>
    <div className="max-w-md mx-auto space-y-4 mb-8">
      <div className="flex justify-between">
        <span className="text-gray-600">Service :</span>
        <span className="font-medium text-gray-800">{service.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Date :</span>
        <span>{format(date, 'EEEE d MMMM yyyy', { locale: fr })}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Heure :</span>
        <span>{time || "-"}</span>
      </div>
      <div className="flex justify-between text-lg font-semibold">
        <span>Total :</span>
        <span className="text-blue-600 font-medium">{service.price.toLocaleString()} XAF</span>
      </div>
    </div>
    <button
      onClick={onConfirm}
      className="w-full max-w-xs mx-auto bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
    >
      Confirmer et Payer
    </button>
  </motion.div>
);

const BookingPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const expertId = queryParams.get('expertId');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'client') {
      setError("Seuls les clients peuvent réserver un rendez-vous.");
      setLoading(false);
      return;
    }
    if (!expertId) {
      setError("ExpertId manquant dans l'URL.");
      setLoading(false);
      return;
    }
    const currentMonth = format(new Date(), 'yyyy-MM');
    const fetchData = async () => {
      try {
        const [servicesRes, availabilityRes] = await Promise.all([
          api.get(`/services/expert/${expertId}`),
          api.get(`/availability/${expertId}?month=${currentMonth}`)
        ]);
        setServices(servicesRes.data);
        setAvailabilities(
          availabilityRes.data.map((a: Availability) => ({
            ...a,
            date: new Date(a.date).toISOString()
          }))
        );
      } catch (err) {
        setError('Erreur de connexion au serveur - Code 500');
        console.error('Détails:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [expertId, user]);

  const handleBooking = async () => {
    if (!user) return navigate('/login');
    try {
      await axios.post('/appointments', {
        serviceId: selectedService?.id,
        expertId,
        startTime: selectedTime,
        endTime: selectedTime // Adaptation possible selon la logique métier
      });
      navigate('/booking-confirmation');
    } catch (err) {
      setError('Erreur lors de la réservation');
      console.error('Erreur réservation:', err);
    }
  };

  const goToNextStep = () => {
    if (step === 1 && !selectedService) {
      setError("Veuillez sélectionner un service.");
      return;
    }
    if (step === 2 && !selectedTime) {
      setError("Veuillez sélectionner une heure.");
      return;
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const goToPreviousStep = () => setStep(prev => prev - 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <ProgressIndicator step={step} />
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <ServiceSelection
                services={services}
                onSelect={(service) => {
                  setSelectedService(service);
                  setStep(2);
                }}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={goToNextStep}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <DateTimeSelection
                availabilities={availabilities}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onTimeSelect={(time) => setSelectedTime(time)}
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={goToPreviousStep}
                  className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <button
                  onClick={goToNextStep}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={!selectedTime}
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
          {step === 3 && selectedService && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <ConfirmationStep
                service={selectedService}
                date={selectedDate}
                time={selectedTime}
                onConfirm={handleBooking}
              />
              <div className="flex justify-start mt-4">
                <button
                  onClick={goToPreviousStep}
                  className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BookingPage;
