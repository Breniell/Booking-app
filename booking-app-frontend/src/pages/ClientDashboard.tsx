// import { useAuthStore } from '../lib/store.ts';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import React from 'react';

// interface Appointment {
//     id: number;
//     expertName: string;
//     serviceName: string;
//     startTime: string;
//     status: string;
// }

// interface ExpertRecommendation {
//     id: number;
//     name: string;
//     expertise: string;
//     rating: number;
// }

// export function ClientDashboard() {
//     const { user } = useAuthStore();
//     const [appointments, setAppointments] = useState<Appointment[]>([]);
//     const [recommendations, setRecommendations] = useState<ExpertRecommendation[]>([]);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 // Fetch appointments
//                 const appointmentsResponse = await axios.get(`/api/clients/${user?.id}/appointments`);
//                 setAppointments(appointmentsResponse.data);

//                 // Fetch expert recommendations
//                 const recommendationsResponse = await axios.get('/api/experts/recommendations');
//                 setRecommendations(recommendationsResponse.data);
//             } catch (error) {
//                 console.error('Error fetching dashboard data:', error);
//             }
//         };

//         fetchDashboardData();
//     }, [user]);

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <section className="bg-white rounded-lg shadow-md p-6 mb-8">
//                 <div className="flex items-center gap-4">
//                     <img
//                         src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                         alt="Profile"
//                         className="w-16 h-16 rounded-full object-cover"
//                     />
//                     <div>
//                         <h1 className="text-2xl font-bold">{user?.firstName || 'Client'}</h1>
//                         <p className="text-gray-600">Bienvenue sur votre tableau de bord</p>
//                     </div>
//                 </div>
//             </section>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <section className="bg-white rounded-lg shadow-md p-6">
//                     <h2 className="text-xl font-semibold mb-4">Prochains Rendez-vous</h2>
//                     <div className="space-y-4">
//                         {appointments.length > 0 ? (
//                             appointments.map(appointment => (
//                                 <div key={appointment.id} className="border-b pb-4">
//                                     <h3 className="font-semibold">{appointment.expertName}</h3>
//                                     <p className="text-gray-600">{appointment.serviceName}</p>
//                                     <p className="text-gray-600">{appointment.startTime}</p>
//                                     <p className="text-gray-600">Status: {appointment.status}</p>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-gray-600">Aucun rendez-vous à venir</p>
//                         )}
//                     </div>
//                 </section>

//                 <section className="bg-white rounded-lg shadow-md p-6">
//                     <h2 className="text-xl font-semibold mb-4">Experts Recommandés</h2>
//                     <div className="space-y-4">
//                         {recommendations.length > 0 ? (
//                             recommendations.map(recommendation => (
//                                 <div key={recommendation.id} className="border-b pb-4">
//                                     <h3 className="font-semibold">{recommendation.name}</h3>
//                                     <p className="text-gray-600">{recommendation.expertise}</p>
//                                     <p className="text-gray-600">Rating: {recommendation.rating}</p>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-gray-600">Aucune recommandation pour le moment</p>
//                         )}
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }
