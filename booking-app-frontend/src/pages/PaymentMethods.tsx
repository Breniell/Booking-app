// pages/PaymentMethods.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CreditCard, Plus, Check } from 'lucide-react';

interface PaymentMethod {
    id: number;
    cardNumber: string;
    expiryDate: string;
    cardType: string;
    isDefault: boolean;
}

export function PaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [newCard, setNewCard] = useState<{ cardNumber: string; expiryDate: string; cardType: string }>({
        cardNumber: '',
        expiryDate: '',
        cardType: 'Visa'
    });

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const paymentMethodsData = [
                    { id: 1, cardNumber: '************1234', expiryDate: '12/24', cardType: 'Visa', isDefault: true },
                    { id: 2, cardNumber: '************5678', expiryDate: '10/25', cardType: 'MasterCard', isDefault: false }
                ];
                setPaymentMethods(paymentMethodsData);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            }
        };
        fetchPaymentMethods();
    }, []);

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // API call
            const newMethod = { ...newCard, id: Date.now(), isDefault: false };
            setPaymentMethods(prev => [...prev, newMethod]);
            setShowAddCardForm(false);
            setNewCard({ cardNumber: '', expiryDate: '', cardType: 'Visa' });
        } catch (error) {
            console.error('Error adding payment method:', error);
        }
    };

    const handleMakeDefault = (id: number) => {
        setPaymentMethods(prev =>
            prev.map(method => ({
                ...method,
                isDefault: method.id === id
            }))
        );
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
                        <CreditCard size={24} />
                        <span>Méthodes de Paiement</span>
                    </h1>
                    <button onClick={() => setShowAddCardForm(true)} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center space-x-2">
                        <Plus size={16} />
                        <span>Ajouter une Carte</span>
                    </button>
                </div>

                <div>
                    {paymentMethods.length > 0 ? (
                        paymentMethods.map(method => (
                            <motion.div
                                key={method.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border rounded-lg p-4 mb-4"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">Carte {method.cardType}</h3>
                                        <p className="text-gray-600">Numéro: {method.cardNumber}</p>
                                        <p className="text-gray-600">Expiration: {method.expiryDate}</p>
                                    </div>
                                    <div>
                                        {method.isDefault ? (
                                            <span className="text-green-500 flex items-center space-x-1">
                                                <Check size={16} />
                                                <span>Par Défaut</span>
                                            </span>
                                        ) : (
                                            <button onClick={() => handleMakeDefault(method.id)} className="text-primary hover:text-primary-dark transition-colors">
                                                Définir par défaut
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-600">Aucune méthode de paiement enregistrée.</p>
                    )}
                </div>

                {showAddCardForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4 overflow-hidden"
                        onSubmit={handleAddCard}
                    >
                        <div>
                            <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">Numéro de Carte</label>
                            <input
                                type="text"
                                id="cardNumber"
                                value={newCard.cardNumber}
                                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                                placeholder="**** **** **** ****"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">Date d'Expiration</label>
                            <input
                                type="text"
                                id="expiryDate"
                                value={newCard.expiryDate}
                                onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                                placeholder="MM/AA"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cardType" className="block text-gray-700 text-sm font-bold mb-2">Type de Carte</label>
                            <select
                                id="cardType"
                                value={newCard.cardType}
                                onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option>Visa</option>
                                <option>MasterCard</option>
                                <option>American Express</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                Ajouter
                            </button>
                        </div>
                    </motion.form>
                )}
            </motion.div>
        </div>
    );
}
