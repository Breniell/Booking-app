import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';  
import api from '../lib/api.ts';  
import { motion } from 'framer-motion';  
import { useAuthStore } from '../lib/store.ts';  
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';  
import SocialLogin from '../components/SocialLogin.tsx';  

const containerVariants = {  
    hidden: { opacity: 0, scale: 0.95 },  
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }  
};  

const Register: React.FC = () => {  
    const navigate = useNavigate();  
    const { setUser } = useAuthStore();  

    const [firstName, setFirstName] = useState('');  
    const [lastName, setLastName] = useState('');  
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');  
    const [role, setRole] = useState<'client' | 'expert'>('client');  
    const [error, setError] = useState<string | null>(null);  
    const [loading, setLoading] = useState(false);  

    const handleRegister = async (e: React.FormEvent) => {  
        e.preventDefault();  
        setError(null);  
        setLoading(true);  
        try {  
            const response = await api.post('/users/register', {  
                firstName,  
                lastName,  
                email,  
                password,  
                role  
            });  
            const { token, user } = response.data;  
            localStorage.setItem('token', token);  
            setUser(user);  
            navigate('/');  
            //user.role === 'expert' ? '/expert/dashboard' : '/client/dashboard'
        } catch (err: any) {  
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');  
        } finally {  
            setLoading(false);  
        }  
    };  

    return (  
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4">  
            <motion.div  
                variants={containerVariants}  
                initial="hidden"  
                animate="visible"  
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8"  
            >  
                {/* Nom de l'application bien visible */}  
                <div className="text-center mb-6">  
                    <h1 className="text-4xl font-bold text-primary mb-2">ReservEase</h1>  
                    <p className="text-gray-600 dark:text-gray-400">Commencez votre expérience</p>  
                </div>  

                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">  
                    Inscription  
                </h2>  

                {error && <div className="mb-4 text-center text-red-500">{error}</div>}  

                <form onSubmit={handleRegister} className="space-y-5">  
                    <div className="grid grid-cols-2 gap-4">  
                        <div>  
                            <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 mb-2">Prénom</label>  
                            <div className="relative flex items-center">  
                                {/* Ajout de flex items-center */}  
                                <FaUser className="absolute left-3 text-gray-500" />  
                                <input  
                                    id="firstName"  
                                    type="text"  
                                    value={firstName}  
                                    onChange={(e) => setFirstName(e.target.value)}  
                                    required  
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"  
                                    placeholder="Votre prénom"  
                                />  
                            </div>  
                        </div>  
                        <div>  
                            <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 mb-2">Nom</label>  
                            <div className="relative flex items-center">  
                                {/* Ajout de flex items-center */}  
                                <FaUser className="absolute left-3 text-gray-500" />  
                                <input  
                                    id="lastName"  
                                    type="text"  
                                    value={lastName}  
                                    onChange={(e) => setLastName(e.target.value)}  
                                    required  
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"  
                                    placeholder="Votre nom"  
                                />  
                            </div>  
                        </div>  
                    </div>  
                    <div>  
                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>  
                        <div className="relative flex items-center">  
                            {/* Ajout de flex items-center */}  
                            <FaEnvelope className="absolute left-3 text-gray-500" />  
                            <input  
                                id="email"  
                                type="email"  
                                value={email}  
                                onChange={(e) => setEmail(e.target.value)}  
                                required  
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"  
                                placeholder="Votre email"  
                            />  
                        </div>  
                    </div>  
                    <div>  
                        <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Mot de passe</label>  
                        <div className="relative flex items-center">  
                            {/* Ajout de flex items-center */}  
                            <FaLock className="absolute left-3 text-gray-500" />  
                            <input  
                                id="password"  
                                type="password"  
                                value={password}  
                                onChange={(e) => setPassword(e.target.value)}  
                                required  
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"  
                                placeholder="Votre mot de passe"  
                            />  
                        </div>  
                    </div>  
                    <div>  
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Vous êtes</label>  
                        <div className="flex space-x-4">  
                            <label className="flex items-center">  
                                <input  
                                    type="radio"  
                                    value="client"  
                                    checked={role === 'client'}  
                                    onChange={() => setRole('client')}  
                                    className="form-radio text-primary"  
                                />  
                                <span className="ml-2">Client</span>  
                            </label>  
                            <label className="flex items-center">  
                                <input  
                                    type="radio"  
                                    value="expert"  
                                    checked={role === 'expert'}  
                                    onChange={() => setRole('expert')}  
                                    className="form-radio text-primary"  
                                />  
                                <span className="ml-2">Expert</span>  
                            </label>  
                        </div>  
                    </div>  
                    <button  
                        type="submit"  
                        disabled={loading}  
                        className="w-full bg-secondary hover:bg-secondary-dark text-white py-3 rounded-xl transition-colors flex items-center justify-center"  
                    >  
                        {loading ? "Inscription en cours..." : "S'inscrire"}  
                    </button>  
                </form>  
                <p className="mt-6 text-center text-gray-600 dark:text-gray-400">  
                    Vous avez déjà un compte ?{' '}  
                    <Link to="/login" className="text-primary hover:underline">  
                        Connectez-vous  
                    </Link>  
                </p>  
                <div className="mt-6">  
                    <SocialLogin />  
                </div>  
            </motion.div>  
        </div>  
    );  
};  

export default Register;  