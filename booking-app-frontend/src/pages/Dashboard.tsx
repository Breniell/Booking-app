// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store.ts';
import api from '../lib/api.ts';
import {
  Loader,
  Calendar,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Clock,
  PlusCircle,
  Zap,
  CalendarDays,
  Star
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

// Interfaces
interface Appointment {
  id: number;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  Service: { name: string };
  Client?: { firstName: string; lastName: string };
  Expert?: { firstName: string; lastName: string };
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  // Autres champs si nécessaire
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, bgColor, textColor }) => (
  <div
    className="p-5 rounded-lg shadow-md flex items-center transition-transform hover:scale-105"
    style={{ backgroundColor: bgColor }}
  >
    <div
      className="mr-4 p-3 rounded-full bg-white bg-opacity-30"
      style={{ color: textColor }}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm" style={{ color: "#374151" }}>{title}</p>
      <p className="text-2xl font-bold" style={{ color: textColor }}>{value}</p>
    </div>
  </div>
);

interface StatisticCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'green' | 'yellow' | 'blue';
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, icon, color }) => {
  let bgColor = '';
  let txtColor = '';
  if (color === 'green') {
    bgColor = "#bbf7d0";
    txtColor = "#166534";
  } else if (color === 'yellow') {
    bgColor = "#fef3c7";
    txtColor = "#92400e";
  } else if (color === 'blue') {
    bgColor = "#bfdbfe";
    txtColor = "#1e40af";
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
      <div className="mr-4 p-3 rounded-full" style={{ backgroundColor: bgColor, color: txtColor }}>
        {icon}
      </div>
      <div>
        <p className="text-sm" style={{ color: "#374151" }}>{title}</p>
        <p className="text-2xl font-bold" style={{ color: "#1f2937" }}>{value}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = user.role === 'client' ? `/clients/${user.id}` : `/experts/${user.id}`;
        
        // Récupération des rendez-vous
        const appointmentsResponse = await api.get(
          user.role === 'client'
            ? `/appointments/client/${user.id}`
            : `/appointments/expert/${user.id}`
        );
        setAppointments(appointmentsResponse.data);
        
        if (user.role === 'expert') {
          const revenueResponse = await api.get(`/experts/${user.id}/revenue`);
          setTotalRevenue(revenueResponse.data.totalRevenue || 0);
          
          const clientsResponse = await api.get(`/experts/${user.id}/clients`);
          setTotalClients(clientsResponse.data.totalClients || 0);
          
          const servicesResponse = await api.get(`/services/expert/${user.id}`);
          setServices(servicesResponse.data);
          
          setAverageRating(0); // Ajustez selon vos données réelles
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, navigate]);

  useEffect(() => {
    if (appointments.length > 0 && user?.role === 'expert') {
      const bookingDates = appointments.map(app =>
        format(parseISO(app.startTime), 'dd MMM', { locale: fr })
      );
      const bookingRevenues = appointments.map(app => 10); // À remplacer par la valeur réelle
      const chartData = {
        labels: bookingDates,
        datasets: [{
          label: 'Revenu par RDV',
          data: bookingRevenues,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
      const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Revenu (XAF)' } },
            x: { title: { display: true, text: 'Date' } }
          }
        }
      };
      const revenueChart = new Chart(
        document.getElementById('revenueChart') as HTMLCanvasElement,
        chartConfig
      );
      return () => revenueChart.destroy();
    }
  }, [appointments, user]);

  const totalAppointments = appointments.length;
  const upcoming = appointments.filter(app => app.status === 'scheduled').length;
  const completed = appointments.filter(app => app.status === 'completed').length;
  const cancelled = appointments.filter(app => app.status === 'cancelled').length;
  const filteredAppointments = appointments;
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-8">
          <div
            className="p-6 rounded-xl shadow-lg"
            style={{ background: "linear-gradient(to bottom right, #e9d5ff, #bfdbfe)" }}
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: "#374151" }}>
              <Zap className="mr-2" style={{ color: "#5b21b6" }} />
              Actions Rapides
            </h3>
            <div className="grid gap-3">
              {user.role === 'expert' ? (
                <>
                  <button
                    onClick={() => navigate('/expert/services/create')}
                    className="w-full flex items-center space-x-3 py-4 px-5 rounded-xl transition-all"
                    style={{ backgroundColor: "#6d28d9", color: "#ffffff" }}
                  >
                    <PlusCircle size={20} />
                    <span className="font-medium">Créer un Service</span>
                  </button>
                  <button
                    onClick={() => navigate('/expert/calendar')}
                    className="w-full flex items-center space-x-3 py-4 px-5 rounded-xl transition-all"
                    style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                  >
                    <CalendarDays size={20} />
                    <span className="font-medium">Agenda</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/services')}
                  className="w-full flex items-center space-x-3 py-4 px-5 rounded-xl transition-all"
                  style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
                >
                  <PlusCircle size={20} />
                  <span className="font-medium">Réserver un RDV</span>
                </button>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#374151" }}>Résumé</h2>
            <div className="space-y-4">
              <SummaryCard
                title="Total RDV"
                value={totalAppointments}
                icon={<Calendar size={24} style={{ color: "#1e3a8a" }} />}
                bgColor="#bfdbfe"
                textColor="#1e40af"
              />
              <SummaryCard
                title="À venir"
                value={upcoming}
                icon={<Clock size={24} style={{ color: "#5b21b6" }} />}
                bgColor="#e9d5ff"
                textColor="#4c1d95"
              />
              <SummaryCard
                title="Terminés"
                value={completed}
                icon={<CheckCircle size={24} style={{ color: "#166534" }} />}
                bgColor="#bbf7d0"
                textColor="#166534"
              />
              <SummaryCard
                title="Annulés"
                value={cancelled}
                icon={<XCircle size={24} style={{ color: "#991b1b" }} />}
                bgColor="#fecaca"
                textColor="#991b1b"
              />
            </div>
          </div>
        </aside>
        {/* Contenu principal */}
        <section className="md:col-span-3 space-y-6">
          <div className="p-6 rounded-xl shadow-md" style={{ backgroundColor: "#ffffff" }}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#1f2937" }}>Mes Rendez-vous</h1>
                <p className="mt-2" style={{ color: "#4b5563" }}>
                  {user?.role === 'expert'
                    ? `${completed}/${totalAppointments} RDV terminés`
                    : `${upcoming} RDV à venir`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: "#bfdbfe" }}>
                  <User size={24} style={{ color: "#1e40af" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#4b5563" }}>Statut actuel</p>
                  <p className="text-xl font-bold" style={{ color: "#1f2937" }}>
                    {user?.role === 'expert'
                      ? `${totalClients} clients`
                      : `${totalAppointments} RDV`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {user?.role === 'expert' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatisticCard
                  title="Revenu Total"
                  value={totalRevenue}
                  icon={<DollarSign size={24} style={{ color: "#166534" }} />}
                  color="green"
                />
                <StatisticCard
                  title="Note Moyenne"
                  value={averageRating}
                  icon={<Star size={24} style={{ color: "#92400e" }} />}
                  color="yellow"
                />
                <StatisticCard
                  title="Clients Actifs"
                  value={totalClients}
                  icon={<User size={24} style={{ color: "#1e40af" }} />}
                  color="blue"
                />
              </div>
              <div className="p-6 rounded-xl shadow-inner mb-8" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: "#1f2937" }}>
                  Évolution des Revenus <span className="ml-2 text-sm" style={{ color: "#6b7280" }}>(30 derniers jours)</span>
                </h2>
                <canvas id="revenueChart" width="400" height="150"></canvas>
              </div>
              {/* Section Mes Services */}
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "#1f2937" }}>Mes Services</h2>
                {services.length === 0 ? (
                  <p style={{ color: "#4b5563" }}>Aucun service créé.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((s) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-4 rounded-xl shadow-lg flex flex-col justify-between"
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <h3 className="text-xl font-semibold" style={{ color: "#1f2937" }}>{s.name}</h3>
                        <p className="mt-2" style={{ color: "#4b5563" }}>{s.description}</p>
                        <button
                          onClick={() => navigate(`/expert/services/edit/${s.id}`)}
                          className="mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
                        >
                          Modifier
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {filteredAppointments.length === 0 ? (
            <p style={{ color: "#4b5563" }}>Aucun rendez-vous trouvé.</p>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-lg shadow-lg p-6 flex flex-col md:flex-row justify-between items-center"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>{app.Service.name}</h2>
                    <p style={{ color: "#4b5563" }}>
                      {format(parseISO(app.startTime), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })} - {format(parseISO(app.endTime), 'HH:mm', { locale: fr })}
                    </p>
                    <span
                      className="inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor:
                          app.status === 'scheduled'
                            ? "#3b82f6"
                            : app.status === 'completed'
                            ? "#10b981"
                            : "#ef4444",
                        color: "#ffffff"
                      }}
                    >
                      {app.status === 'scheduled' && 'Prévu'}
                      {app.status === 'completed' && 'Terminé'}
                      {app.status === 'cancelled' && 'Annulé'}
                    </span>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-6">
                    {user.role === 'client' && app.Expert && (
                      <p style={{ color: "#374151" }}>
                        Avec : {app.Expert.firstName} {app.Expert.lastName}
                      </p>
                    )}
                    {user.role === 'expert' && app.Client && (
                      <p style={{ color: "#374151" }}>
                        Client : {app.Client.firstName} {app.Client.lastName}
                      </p>
                    )}
                    <button className="px-6 py-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}
                    >
                      Voir Détails
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#1f2937" }}>
              Rendez-vous récents
            </h2>
            {recentAppointments.length === 0 ? (
              <p style={{ color: "#4b5563" }}>Aucun rendez-vous récent.</p>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-lg shadow p-4 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div>
                      <p className="text-lg font-semibold" style={{ color: "#1f2937" }}>
                        {app.Service.name}
                      </p>
                      <p className="text-sm" style={{ color: "#4b5563" }}>
                        {format(parseISO(app.startTime), 'dd MMM yyyy, HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}
                    >
                      Détails
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
