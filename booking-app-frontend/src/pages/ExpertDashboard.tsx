// import { useAuthStore } from '../lib/store.ts';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Calendar, Clock, ListChecks, Coins } from 'lucide-react';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';
// import React from 'react';

// interface Appointment {
//     id: number;
//     clientName: string;
//     serviceName: string;
//     startTime: string;
//     status: string;
// }

// export function ExpertDashboard() {
//     const { user } = useAuthStore();
//     const [appointments, setAppointments] = useState<Appointment[]>([]);
//     const [monthlyRevenue, setMonthlyRevenue] = useState(0);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 // Mock API calls
//                 const appointmentsData = [
//                     { id: 1, clientName: 'Alice Johnson', serviceName: 'Consultation', startTime: '2024-02-29T10:00:00', status: 'Scheduled' },
//                     { id: 2, clientName: 'Bob Williams', serviceName: 'Coaching', startTime: '2024-03-01T14:00:00', status: 'Confirmed' }
//                 ];
//                 setAppointments(appointmentsData);

//                 const revenueData = { revenue: 50000 };
//                 setMonthlyRevenue(revenueData.revenue);
//             } catch (error) {
//                 console.error('Error fetching expert dashboard data:', error);
//             }
//         };

//         fetchDashboardData();
//     }, [user]);

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <section className="bg-white rounded-lg shadow-md p-6 mb-8">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                     <div className="flex items-center gap-4 mb-4 md:mb-0">
//                         <img
//                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                             alt="Profile"
//                             className="w-16 h-16 rounded-full object-cover"
//                         />
//                         <div>
//                             <h1 className="text-2xl font-bold">{user?.firstName || 'Expert'}</h1>
//                             <p className="text-gray-600">Expert Consultant</p>
//                         </div>
//                     </div>
//                     <div className="flex gap-4">
//                         <div className="bg-gray-50 p-4 rounded-lg">
//                             <h3 className="text-sm text-gray-600 flex items-center">
//                                 <Calendar size={16} className="mr-1" />
//                                 Rendez-vous cette semaine
//                             </h3>
//                             <p className="text-2xl font-bold">{appointments.length}</p>
//                         </div>
//                         <div className="bg-gray-50 p-4 rounded-lg">
//                             <h3 className="text-sm text-gray-600 flex items-center">
//                                 <Coins size={16} className="mr-1" />
//                                 Revenu ce mois
//                             </h3>
//                             <p className="text-2xl font-bold">{monthlyRevenue.toLocaleString('fr-CA')} XAF</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <section className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
//                     <h2 className="text-xl font-semibold mb-4 flex items-center">
//                         <ListChecks size={20} className="mr-2" />
//                         Prochains Rendez-vous
//                     </h2>
//                     <div className="space-y-4">
//                         {appointments.length > 0 ? (
//                             appointments.map(appointment => (
//                                 <div key={appointment.id} className="border-b pb-4">
//                                     <h3 className="font-semibold">{appointment.clientName}</h3>
//                                     <p className="text-gray-600">{appointment.serviceName}</p>
//                                     <p className="text-gray-600">
//                                         <Clock size={16} className="inline-block mr-1" />
//                                         {format(new Date(appointment.startTime), "EEEE d MMMM 'à' HH:mm", { locale: fr })}
//                                     </p>
//                                     <p className="text-gray-600">Status: {appointment.status}</p>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-gray-600">Aucun rendez-vous à venir</p>
//                         )}
//                     </div>
//                 </section>

//                 <section className="bg-white rounded-lg shadow-md p-6">
//                     <h2 className="text-xl font-semibold mb-4 flex items-center">
//                         <Calendar size={20} className="mr-2" />
//                         Disponibilités
//                     </h2>
//                     <div className="space-y-4">
//                         <button className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center">
//                             Gérer les Disponibilités
//                         </button>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }
