// pages/ClientProfile.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from '../lib/store.ts';
import { User, Mail, Phone, Edit } from 'lucide-react';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export function ClientProfile() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Mock API call
                const profileData = {
                    firstName: user?.firstName || 'John',
                    lastName: user?.lastName || 'Doe',
                    email: user?.email || 'john.doe@example.com',
                    phone: '123-456-7890'
                };
                setProfile(profileData);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [user]);

    const handleEdit = () => setIsEditing(true);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        try {
            // Make API Call here
            console.log('Profil mis à jour avec succès', profile);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center space-x-2">
                        <User size={24} />
                        <span>Profil Client</span>
                    </h1>
                    {!isEditing && (
                        <button onClick={handleEdit} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center space-x-2">
                            <Edit size={16} />
                            <span>Modifier</span>
                        </button>
                    )}
                </div>

                {profile && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">Prénom</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'border-primary' : 'border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'border-primary' : 'border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                disabled
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={profile.phone || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'border-primary' : 'border-gray-300'}`}
                            />
                        </div>

                        {isEditing && (
                            <div className="flex justify-end">
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                    Sauvegarder
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </motion.div>
        </div>
    );
}
