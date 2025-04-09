// src/pages/BookingPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
  isSameDay,
  parseISO,
  format,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../lib/api.ts';
import { useAuthStore } from '../lib/store.ts';
import { useBasketStore } from '../lib/basketStore.ts';
import styled from 'styled-components';
import { toZonedTime } from 'date-fns-tz';

/* ---------- Composants Styled ---------- */
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
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  padding: 2rem;
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

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
  border: none;
  ${({ primary }) =>
    primary
      ? `
    background-color: #3b82f6;
    color: #ffffff;
    &:hover {
      background-color: #2563eb;
      transform: scale(1.02);
    }
  `
      : `
    background-color: #e5e7eb;
    color: #374151;
    &:hover {
      background-color: #d1d5db;
    }
  `}
`;

const CalendarGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DayCell = styled.button<{ selected: boolean; available: boolean }>`
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  border: none;
  cursor: pointer;
  background-color: ${({ selected, available }) =>
    selected ? '#3b82f6' : available ? '#d1fae5' : '#e5e7eb'};
  color: ${({ selected, available }) =>
    selected ? '#ffffff' : available ? '#065f46' : '#6b7280'};
`;

const SlotButton = styled.button`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #ffffff;
  transition: border-color 0.3s ease;
  min-width: 100px;
  cursor: pointer;
  &:hover {
    border-color: #3b82f6;
  }
`;

/* ---------- Composants de la Page ---------- */

/** ProgressIndicator **/
const ProgressIndicator = ({ step }: { step: number }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {[1, 2, 3].map((num) => (
        <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              height: '2rem',
              width: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: num <= step ? '#3b82f6' : '#e5e7eb',
              color: num <= step ? '#ffffff' : '#6b7280',
            }}
          >
            {num < step ? <CheckCircle size={18} /> : num}
          </div>
          {num < 3 && <div style={{ height: '1px', width: '2rem', backgroundColor: '#d1d5db' }} />}
        </div>
      ))}
    </div>
  </motion.div>
);

/** ServiceSelection **/
const ServiceSelection = ({
  services,
  onSelect,
  selectedService,
}: {
  services: Service[];
  onSelect: (service: Service) => void;
  selectedService?: Service;
}) => {
  if (selectedService) {
    return (
      <Card
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
      >
        <Title>{selectedService.name}</Title>
        <Text>{selectedService.description}</Text>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#6b7280' }}>
          <span>Durée : {selectedService.duration} minutes</span>
          <span style={{ color: '#3b82f6' }}>{selectedService.price.toLocaleString()} XAF</span>
        </div>
        {selectedService.videoPlatform && <Text>Plateforme : {selectedService.videoPlatform}</Text>}
      </Card>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
    >
      {services.map((service) => (
        <Card
          key={service.id}
          whileHover={{ scale: 1.03 }}
          onClick={() => onSelect(service)}
          style={{ cursor: 'pointer' }}
        >
          <Title style={{ fontSize: '1.25rem' }}>{service.name}</Title>
          <Text>{service.description}</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
            <span>{service.duration} minutes</span>
            <span style={{ color: '#3b82f6' }}>{service.price.toLocaleString()} XAF</span>
          </div>
        </Card>
      ))}
    </motion.div>
  );
};

/** DateTimeSelection **/
const DateTimeSelection = ({
  availabilities,
  selectedDate,
  onDateChange,
  onTimeSelect,
  setError,
  serviceDuration,
}: DateTimeSelectionProps) => {
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const goToPreviousMonth = () => onDateChange(subMonths(selectedDate, 1));
  const goToNextMonth = () => onDateChange(addMonths(selectedDate, 1));

  // Formater la date sélectionnée au format "yyyy-MM-dd" en UTC
  const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd', { timeZone: 'UTC' });
  console.log("Date sélectionnée :", formattedSelectedDate, "Disponibilités :", availabilities.map(a => a.date));

  // Recherche de la disponibilité correspondant exactement à la date
  const availabilityForDay = availabilities.find((a) => a.date === formattedSelectedDate);
  const defaultSlots = (availabilityForDay && Array.isArray(availabilityForDay.slots))
    ? availabilityForDay.slots
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {/* Navigation du mois */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button onClick={goToPreviousMonth}> <ArrowLeft size={18} /> </Button>
        <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#1f2937' }}>
          {format(selectedDate, 'MMMM yyyy', { locale: fr })}
        </div>
        <Button onClick={goToNextMonth}> <ArrowRight size={18} /> </Button>
      </div>
      {/* Calendrier */}
      <CalendarGridContainer>
        {dayNames.map((day) => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 600, color: '#374151' }}>{day}</div>
        ))}
        {eachDayOfInterval({ start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) }).map(
          (day, idx) => {
            const utcDate = format(toZonedTime(day, 'UTC'), 'yyyy-MM-dd');
            const isAvailable = availabilities.some(a => a.date === utcDate);
            return (
              <DayCell
                key={idx}
                selected={isSameDay(day, selectedDate)}
                available={isAvailable}
                onClick={() => onDateChange(day)}
              >
                {format(day, 'd')}
              </DayCell>
            );
          }
        )}
      </CalendarGridContainer>
      {/* Créneaux */}
      <div>
        {defaultSlots.length === 0 ? (
          <Text>Aucun créneau disponible pour cette date. Veuillez changer de date.</Text>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            {defaultSlots.map((slot) => {
              const slotStart = new Date(`${formattedSelectedDate}T${slot}`);
              const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);
              return (
                <SlotButton key={slot} onClick={() => onTimeSelect(slot)}>
                  {slot} - {format(slotEnd, 'HH:mm')}
                </SlotButton>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/** ConfirmationStep **/
const ConfirmationStep = ({
  service,
  date,
  time,
  onConfirm,
  expectedServiceId,
}: ConfirmationStepProps) => {
  if (service.id !== expectedServiceId) {
    return <Text style={{ color: 'red', textAlign: 'center' }}>Incohérence dans la sélection du service</Text>;
  }
  const formattedDate = format(date, 'yyyy-MM-dd', { timeZone: 'UTC' });
  const start = time ? new Date(`${formattedDate}T${time}`) : null;
  const end = start ? new Date(start.getTime() + service.duration * 60000) : null;
  return (
    <Card
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      style={{ textAlign: 'center' }}
    >
      <CheckCircle className="mx-auto" style={{ color: '#3b82f6', marginBottom: '1.5rem' }} size={48} />
      <Title>Résumé de votre réservation</Title>
      <Card style={{ padding: '1rem', marginBottom: '1rem' }}>
        <Title style={{ fontSize: '1.25rem' }}>{service.name}</Title>
        <Text>{service.description}</Text>
        <Text>Durée : {service.duration} minutes</Text>
        <Text>Prix : {service.price.toLocaleString()} XAF</Text>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Text>Date :</Text>
        <Text>{format(date, 'EEEE d MMMM yyyy', { locale: fr })}</Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Text>Heure de début :</Text>
        <Text>{time || "-"}</Text>
      </div>
      {end && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#3b82f6' }}>
          <Text>Heure de fin :</Text>
          <Text>{format(end, 'HH:mm')}</Text>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 600, color: '#3b82f6' }}>
        <Text>Total :</Text>
        <Text>{service.price.toLocaleString()} XAF</Text>
      </div>
      <Button primary onClick={onConfirm} style={{ marginTop: '1.5rem' }}>
        Confirmer et ajouter au panier
      </Button>
    </Card>
  );
};

/** BookingPage **/
const BookingPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const expertId = queryParams.get('expertId');
  const serviceIdFromQuery = queryParams.get('serviceId');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addItem } = useBasketStore();

  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
    const availabilityEndpoint = serviceIdFromQuery
      ? `/availability/${expertId}?serviceId=${serviceIdFromQuery}`
      : `/availability/${expertId}?month=${currentMonth}`;
    const fetchData = async () => {
      try {
        if (serviceIdFromQuery) {
          const serviceRes = await api.get(`/services/${serviceIdFromQuery}`);
          setSelectedService(serviceRes.data);
          setStep(2);
        } else {
          const servicesRes = await api.get(`/services/expert/${expertId}`);
          setServices(servicesRes.data);
        }
        const availabilityRes = await api.get(availabilityEndpoint);
        const availData: Availability[] = availabilityRes.data;
        console.log("Disponibilités côté client :", availData);
        setAvailabilities(availData);
        if (availData.length > 0) {
          const todayStr = format(new Date(), 'yyyy-MM-dd', { timeZone: 'UTC' });
          const futureDates = availData
            .map(a => a.date)
            .filter(date => date >= todayStr)
            .sort();
          const defaultDate = futureDates.length > 0 ? futureDates[0] : availData[0].date;
          setSelectedDate(new Date(`${defaultDate}T00:00:00Z`));
        }
      } catch (err: any) {
        setError('Erreur de connexion au serveur - Code 500');
        console.error('Détails:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [expertId, user, serviceIdFromQuery]);

  useEffect(() => {
    if (availabilities.length > 0) {
      const availableDates = availabilities.map(a => a.date);
      const current = format(selectedDate, 'yyyy-MM-dd', { timeZone: 'UTC' });
      if (!availableDates.includes(current)) {
        setSelectedDate(new Date(`${availableDates[0]}T00:00:00Z`));
      }
    }
  }, [availabilities, selectedDate]);

  const addToBasket = () => {
    if (!selectedService) {
      setError("Veuillez sélectionner un service.");
      return;
    }
    if (!selectedTime) {
      setError("Veuillez sélectionner une heure.");
      return;
    }
    addItem({
      service: selectedService,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
    });
    navigate('/basket');
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
    setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => setStep((prev) => prev - 1);

  if (loading) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader className="animate-spin" size={48} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
        {error}
      </Container>
    );
  }

  return (
    <Container>
      <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ProgressIndicator step={step} />
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {serviceIdFromQuery && selectedService ? (
                <div style={{ marginBottom: '1rem' }}>
                  <Title>{selectedService.name}</Title>
                  <Text>{selectedService.description}</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    <span>Durée : {selectedService.duration} minutes</span>
                    <span style={{ color: '#3b82f6' }}>{selectedService.price.toLocaleString()} XAF</span>
                  </div>
                  {selectedService.videoPlatform && (
                    <Text style={{ marginTop: '0.5rem' }}>Plateforme : {selectedService.videoPlatform}</Text>
                  )}
                </div>
              ) : (
                <ServiceSelection
                  services={services}
                  onSelect={(service) => {
                    setSelectedService(service);
                    setStep(2);
                  }}
                />
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button primary onClick={goToNextStep}>
                  Next <ArrowRight size={18} />
                </Button>
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
                setError={setError}
                serviceDuration={selectedService ? selectedService.duration : 0}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <Button onClick={goToPreviousStep}> <ArrowLeft size={18} /> Back</Button>
                <Button primary onClick={goToNextStep} disabled={!selectedTime}>
                  Next <ArrowRight size={18} />
                </Button>
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
                onConfirm={addToBasket}
                expectedServiceId={Number(serviceIdFromQuery)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
                <Button className="secondary" onClick={goToPreviousStep}>
                  <ArrowLeft size={18} /> Back
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </Container>
  );
};

export default BookingPage;
