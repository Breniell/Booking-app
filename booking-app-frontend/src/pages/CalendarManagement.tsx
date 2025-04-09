// src/pages/CalendarManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Trash2, Plus, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
  isSameDay
} from 'date-fns';
import { fr } from 'date-fns/locale';
import styled from 'styled-components';
import api from '../lib/api.ts';
import { useAuthStore } from '../lib/store.ts';

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Card = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),
              0 4px 6px -2px rgba(0,0,0,0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
`;

// Bouton avec props transitoires
const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
  border: none;
  background-color: ${({ $primary }) => ($primary ? "#3b82f6" : "#e5e7eb")};
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#374151")};
  &:hover {
    background-color: ${({ $primary }) => ($primary ? "#2563eb" : "#d1d5db")};
    ${({ $primary }) => $primary && "transform: scale(1.02);"}
  }
`;

// Utilisation de props transitoires pour DayCell
const DayCell = styled.button<{ $selected: boolean; $available: boolean }>`
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  border: none;
  cursor: pointer;
  background-color: ${({ $selected, $available }) =>
    $selected ? '#3b82f6' : $available ? '#d1fae5' : '#e5e7eb'};
  color: ${({ $selected, $available }) =>
    $selected ? '#ffffff' : $available ? '#065f46' : '#6b7280'};
`;

const CalendarGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SlotButton = styled.button`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #ffffff;
  transition: border-color 0.3s ease;
  min-width: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;

const FormField = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border 0.2s ease;
  &:focus {
    border-color: #4f46e5;
  }
`;

// Types
interface RawAvailability {
  id: string;
  date: string;      // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  recurring: boolean;
}

interface Service {
  id: number;
  expertId: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  videoPlatform?: string;
  imageUrl: string;
}

const CalendarManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [rawAvailabilities, setRawAvailabilities] = useState<RawAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingAvailability, setEditingAvailability] = useState<RawAvailability | null>(null);

  // Récupération du profil expert puis de ses services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (user) {
          console.log("ID expert (user) :", user.id);
          // Récupérer le profil expert via /api/experts/:userId
          const expertRes = await api.get(`/experts/${user.id}`);
          const expert = expertRes.data;
          console.log("Expert profile :", expert);
          // Récupérer les services de l'expert
          const res = await api.get(`/services/expert/${expert.id}`);
          console.log("Services récupérés :", res.data);
          setServices(res.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
      }
    };
    fetchServices();
  }, [user]);

  // Lorsque le service est sélectionné, récupérer ses disponibilités
  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        if (user && selectedService) {
          const res = await api.get(`/availability/${selectedService.expertId}`, {
            params: { serviceId: selectedService.id }
          });
          console.log("Disponibilités récupérées pour le service", selectedService.id, ":", res.data);
          // Supposons que res.data est un tableau groupé par date, ex: [{ date, slots: [ '09:00', ... ] }, ...]
          const grouped = res.data;
          const reconstructed: RawAvailability[] = grouped.map((g: any) => ({
            id: `${Date.now()}-${g.date}`, // ID temporaire
            date: g.date,
            startTime: g.slots[0],
            endTime: g.slots[g.slots.length - 1],
            recurring: false
          }));
          setRawAvailabilities(reconstructed);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des disponibilités:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailabilities();
  }, [user, selectedService]);

  // Sauvegarde des modifications (envoyer un objet avec la clé "availabilities")
  const handleSave = async () => {
    try {
      await api.put(`/availability/${selectedService?.expertId}`, { availabilities: rawAvailabilities });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Suppression d'un créneau
  const handleDelete = (id: string) => {
    setRawAvailabilities(prev => prev.filter(av => av.id !== id));
  };

  // Ouverture de la modale pour ajouter ou modifier un créneau
  const openAddModal = () => {
    setEditingAvailability(null);
    setModalOpen(true);
  };

  const openEditModal = (av: RawAvailability) => {
    setEditingAvailability(av);
    setModalOpen(true);
  };

  const handleModalSave = (av: RawAvailability) => {
    if (editingAvailability) {
      setRawAvailabilities(prev =>
        prev.map(item => (item.id === editingAvailability.id ? av : item))
      );
    } else {
      setRawAvailabilities(prev => [...prev, { ...av, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const availabilitiesForSelectedDay = rawAvailabilities.filter(av =>
    av.date === format(selectedDate, 'yyyy-MM-dd')
  );

  if (!selectedService) {
    return (
      <Container>
        <Card>
          <Title>Sélectionnez un service</Title>
          {services.length === 0 ? (
            <Text>Aucun service créé pour le moment.</Text>
          ) : (
            <ServiceGrid>
              {services.map(service => (
                <Card
                  key={service.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedService(service)}
                  style={{ cursor: 'pointer' }}
                >
                  <Title style={{ fontSize: '1.5rem' }}>{service.name}</Title>
                  <Text>{service.description}</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>{service.duration} minutes</span>
                    <span style={{ color: '#3b82f6' }}>{service.price.toLocaleString()} XAF</span>
                  </div>
                  {service.videoPlatform && (
                    <Text style={{ marginTop: '0.5rem' }}>Plateforme : {service.videoPlatform}</Text>
                  )}
                </Card>
              ))}
            </ServiceGrid>
          )}
        </Card>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader className="animate-spin" size={48} color="#3b82f6" />
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Gestion des Disponibilités pour {selectedService.name}</Title>
        {/* Navigation mensuelle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <Button onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
            <ArrowLeft size={18} />
          </Button>
          <Text style={{ fontWeight: 700, fontSize: '1.125rem', color: '#1f2937' }}>
            {format(selectedDate, 'MMMM yyyy', { locale: fr })}
          </Text>
          <Button onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
            <ArrowRight size={18} />
          </Button>
        </div>
        <CalendarGridContainer>
          {eachDayOfInterval({ start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) }).map((day, idx) => {
            const utcDate = format(day, 'yyyy-MM-dd');
            const available = rawAvailabilities.some(av => av.date === utcDate);
            return (
              <DayCell
                key={idx}
                $selected={isSameDay(day, selectedDate)}
                $available={available}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, 'd')}
              </DayCell>
            );
          })}
        </CalendarGridContainer>
        <Text style={{ marginBottom: '1rem' }}>
          Créneaux pour le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })} :
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          {availabilitiesForSelectedDay.length === 0 ? (
            <Text>Aucun créneau pour cette date.</Text>
          ) : (
            availabilitiesForSelectedDay.map(av => (
              <SlotButton key={av.id} onClick={() => openEditModal(av)}>
                <span>{av.startTime} - {av.endTime}</span>
                <Trash2 size={16} onClick={(e) => { e.stopPropagation(); handleDelete(av.id); }} />
              </SlotButton>
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button $primary onClick={openAddModal}>
            <Plus size={20} />
            Ajouter un créneau
          </Button>
          <Button $primary onClick={handleSave}>
            <Save size={20} />
            Sauvegarder
          </Button>
        </div>
      </Card>
      <AnimatePresence>
        {modalOpen && (
          <AvailabilityModal
            initialData={
              editingAvailability || {
                date: format(selectedDate, 'yyyy-MM-dd'),
                startTime: '09:00',
                endTime: '17:00',
                recurring: false
              }
            }
            onClose={() => setModalOpen(false)}
            onSave={handleModalSave}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

interface AvailabilityModalProps {
  initialData: RawAvailability;
  onClose: () => void;
  onSave: (av: RawAvailability) => void;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ initialData, onClose, onSave }) => {
  const [data, setData] = useState<RawAvailability>(initialData);

  const handleChange = (field: keyof RawAvailability, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalContent>
        <Title style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          {initialData.id ? 'Modifier le créneau' : 'Ajouter un créneau'}
        </Title>
        <FormField>
          <Label>Date</Label>
          <Input
            type="date"
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </FormField>
        <FormField style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Label>Début</Label>
            <Input
              type="time"
              value={data.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label>Fin</Label>
            <Input
              type="time"
              value={data.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
            />
          </div>
        </FormField>
        <FormField style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Input
            type="checkbox"
            checked={data.recurring}
            onChange={(e) => handleChange('recurring', e.target.checked)}
            style={{ width: '1rem', height: '1rem' }}
          />
          <Label style={{ margin: 0 }}>Rendre récurrent</Label>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button onClick={onClose}>Annuler</Button>
          <Button $primary onClick={() => onSave(data)}>Enregistrer</Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CalendarManagement;
