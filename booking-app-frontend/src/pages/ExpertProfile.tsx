/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, ChangeEvent } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store.ts';
import api from '../lib/api.ts';
import {
  Mail,
  Phone,
  Edit,
  Camera,
  Lock,
  DownloadCloud,
  Trash2,
  Sun,
  Moon,
  BarChart2,
  Star,
} from 'lucide-react';


// ----------------------------------------------------------
// Isolation Wrapper pour contrer les styles globaux
// ----------------------------------------------------------
const ProfileWrapper = styled.div`
  all: initial; /* Réinitialise tous les styles hérités */
  box-sizing: border-box !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  width: 100%;
  min-height: 100vh;
  background-color: #f9fafb !important; /* bg-gray-50 */
  color: #111827 !important; /* text-gray-900 */
  a, button {
    all: unset;
    cursor: pointer;
    font-family: inherit;
  }
`;

// Container central
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

// -------------------------
// Définition des Types
// -------------------------
interface ExpertProfileData {
  id: number;
  userId: number;
  bio: string;
  expertise: string;
  profileImage?: string;
  User: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  expertId?: number;
}

interface Payment {
  id: number;
  invoice: string;
  amount: number;
  date: string;
  status: 'payé' | 'en attente' | 'annulé';
}

interface StatisticData {
  appointments: number;
  reviews: number;
  rating: number;
}

// -------------------------
// Type pour les onglets
// -------------------------
type Tab =
  | 'info'
  | 'services'
  | 'security'
  | 'notifications'
  | 'privacy'
  | 'activity'
  | 'payments'
  | 'statistics';

// -------------------------
// Composant Principal
// -------------------------
const ExpertProfile: React.FC = () => {
  // Récupérer l'expert à partir des paramètres ou du store
  const { expertId: paramExpertId } = useParams<{ expertId: string }>();
  const { user } = useAuthStore();
  const effectiveExpertId = paramExpertId || user?.id;

  const [expert, setExpert] = useState<ExpertProfileData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTab, setSelectedTab] = useState<Tab>('info');

  // États pour "Sécurité"
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // États pour "Notifications" (pour expert, le principe peut être similaire)
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailFreq, setEmailFreq] = useState('immédiat');

  // États pour "Confidentialité"
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private' | 'custom'>('public');
  const [emailVisibility, setEmailVisibility] = useState<'everyone' | 'friends' | 'only-me'>('everyone');
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // États pour "Activité" (simulation)
  const [activities, setActivities] = useState<Array<{ id: number; description: string; date: string }>>([]);

  // États pour "Paiements"
  const [payments, setPayments] = useState<Payment[]>([]);

  // États pour "Statistiques & Avis"
  const [statistics, setStatistics] = useState<StatisticData | null>(null);

  // -------------------------
  // Récupération des données
  // -------------------------
  useEffect(() => {
    if (!effectiveExpertId) {
      console.error("Aucun identifiant d'expert n'a été fourni.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        // Récupération du profil expert
        const expertResponse = await api.get(`/experts/${effectiveExpertId}`);
        setExpert(expertResponse.data);
        // Récupération des services de l’expert
        const servicesResponse = await api.get(`/services/expert/${effectiveExpertId}`);
        setServices(servicesResponse.data);
        // Simuler l'activité récente
        setActivities([
          { id: 1, description: 'Création du profil', date: '2025-04-01 09:00' },
          { id: 2, description: 'Ajout d\'un service', date: '2025-04-02 11:15' },
          { id: 3, description: 'Mise à jour du profil', date: '2025-04-03 14:30' },
          { id: 4, description: 'Réception d\'un avis', date: '2025-04-04 16:00' },
        ]);
        // Simuler Paiements
        setPayments([
          { id: 1, invoice: 'INV-1001', amount: 50000, date: '2025-03-31', status: 'payé' },
          { id: 2, invoice: 'INV-1002', amount: 75000, date: '2025-04-02', status: 'en attente' },
        ]);
        // Simuler Statistiques & Avis
        setStatistics({ appointments: 30, reviews: 15, rating: 4.7 });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'expert:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [effectiveExpertId]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setExpert(prev =>
        prev ? { ...prev, profileImage: URL.createObjectURL(e.target.files[0]) } : prev
      );
    }
  };

  // -------------------------
  // Sauvegarder "Informations de Base"
  // -------------------------
  const handleInfoSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        await api.put(`/experts/${effectiveExpertId}/upload-image`, formData);
      }
      await api.put(`/experts/${effectiveExpertId}`, expert);
      console.log('Profil expert mis à jour avec succès', expert);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil expert:', error);
    }
  };

  // -------------------------
  // Sauvegarder "Sécurité"
  // -------------------------
  const handleSecuritySave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    try {
      await api.put(`/experts/${effectiveExpertId}/security`, {
        currentPassword,
        newPassword,
        twoFactorEnabled,
      });
      console.log('Paramètres de sécurité mis à jour');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la sécurité', error);
    }
  };

  // -------------------------
  // Sauvegarder "Notifications" (similaire au client)
  // -------------------------
  const handleNotificationsSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/experts/${effectiveExpertId}/notifications`, {
        emailNotif,
        smsNotif,
        pushNotif,
        emailFreq,
      });
      console.log('Préférences de notifications mises à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications', error);
    }
  };

  // -------------------------
  // Sauvegarder "Confidentialité"
  // -------------------------
  const handlePrivacySave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/experts/${effectiveExpertId}/privacy`, {
        profileVisibility,
        emailVisibility,
        language,
        theme,
      });
      console.log('Paramètres de confidentialité mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la confidentialité', error);
    }
  };

  // -------------------------
  // Rafraîchir "Paiements"
  // -------------------------
  const handleRefreshPayments = async () => {
    try {
      const response = await api.get(`/experts/${effectiveExpertId}/payments`);
      // Mettre à jour les paiements
      // Pour la simulation, nous utilisons les paiements définis lors de useEffect
      setPayments(response.data);
      console.log('Paiements rafraîchis');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des paiements', error);
    }
  };

  // Autres actions (Export, Suppression)
  const handleExportData = () => {
    alert("Demande d'export de données envoyée.");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      alert("Compte supprimé (simulation).");
    }
  };

  if (loading) {
    return (
      <ProfileWrapper>
        <div
          css={css`
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4b5563 !important;
          `}
        >
          Chargement du profil...
        </div>
      </ProfileWrapper>
    );
  }

  // Définition des onglets
  const tabList: Array<{ id: Tab; label: string }> = [
    { id: 'info', label: 'Informations' },
    { id: 'services', label: 'Services' },
    { id: 'security', label: 'Sécurité' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Confidentialité' },
    { id: 'activity', label: 'Activité' },
    { id: 'payments', label: 'Paiements' },
    { id: 'statistics', label: 'Statistiques & Avis' },
  ];

  return (
    <ProfileWrapper>
      <Container>
        {/* HEADER HERO */}
        <div
          css={css`
            position: relative;
            width: 100%;
          `}
        >
          <div
            css={css`
              height: 16rem;
              background: linear-gradient(to right, #2563eb, #4338ca) !important;
            `}
          ></div>
          <div
            css={css`
              position: absolute;
              inset: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            `}
          >
            <div css={css`position: relative;`}>
              <div
                css={css`
                  width: 12rem;
                  height: 12rem;
                  border-radius: 50% !important;
                  border: 0.25rem solid #fff !important;
                  box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,0.2) !important;
                  overflow: hidden;
                  background-color: #e5e7eb !important;
                `}
              >
                {expert?.profileImage ? (
                  <img
                    src={expert.profileImage}
                    alt={`${expert.User.firstName} ${expert.User.lastName}`}
                    css={css`
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    `}
                  />
                ) : (
                  <div
                    css={css`
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 3rem;
                      color: #6b7280;
                    `}
                  >
                    {expert.User.firstName.charAt(0)}
                    {expert.User.lastName.charAt(0)}
                  </div>
                )}
              </div>
              {/* Option d'upload d'image en mode édition */}
              {/* Vous pourriez ajouter ici la possibilité d'activer le mode édition */}
            </div>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          css={css`
            margin-top: -3rem;
          `}
        >
          <div
            css={css`
              background: #fff !important;
              border-radius: 1rem !important;
              box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1) !important;
              overflow: hidden;
            `}
          >
            {/* BARRE DE NAVIGATION (ONGLETS) */}
            <div
              css={css`
                display: flex;
                background: #f3f4f6 !important;
              `}
            >
              {tabList.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  css={css`
                    flex: 1;
                    padding: 0.75rem 0;
                    text-align: center;
                    font-weight: 600;
                    transition: background 0.3s, color 0.3s;
                    ${selectedTab === tab.id
                      ? 'background: #2563eb !important; color: #fff !important;'
                      : 'color: #374151 !important; &:hover { background: #e5e7eb !important; }'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONTENU DES ONGLETS */}
            <div css={css`padding: 1.5rem;`}>
              <AnimatePresence exitBeforeEnter>
                {selectedTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET INFORMATIONS DE BASE */}
                    <form
                      onSubmit={handleInfoSave}
                      css={css`
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
                        gap: 1.5rem;
                      `}
                    >
                      <div>
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={expert?.User.firstName}
                          disabled
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db !important;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                          `}
                        />
                      </div>
                      <div>
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
                          Nom
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={expert?.User.lastName}
                          disabled
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db !important;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                          `}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
                          Expertise & Bio
                        </label>
                        <textarea
                          name="bio"
                          value={expert?.bio}
                          disabled
                          css={css`
                            width: 100%;
                            min-height: 6rem;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db !important;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                            resize: vertical;
                          `}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <Link
                          to={`/expert/edit/${effectiveExpertId}`}
                          css={css`
                            text-align: right;
                            font-size: 0.875rem;
                            color: #2563eb;
                            text-decoration: underline;
                          `}
                        >
                          Modifier le profil
                        </Link>
                      </div>
                    </form>
                  </motion.div>
                )}

                {selectedTab === 'services' && (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET SERVICES PROPOSÉS */}
                    <div css={css`margin-bottom: 1.5rem;`}>
                      <h2 css={css`font-size: 1.5rem; font-weight: 600; color: #111827; margin-bottom: 0.75rem;`}>
                        Mes Services Proposés
                      </h2>
                      <Link
                        to={`/expert/services/new`}
                        css={css`
                          background: #2563eb;
                          color: #fff;
                          padding: 0.75rem 1rem;
                          border-radius: 0.375rem;
                          display: inline-block;
                          margin-bottom: 1rem;
                          transition: background 0.3s;
                          &:hover { background: #1d4ed8; }
                        `}
                      >
                        Ajouter un Service
                      </Link>
                    </div>
                    {services.length > 0 ? (
                      <div
                        css={css`
                          display: grid;
                          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
                          gap: 1.5rem;
                        `}
                      >
                        {services.map((service) => (
                          <motion.div
                            key={service.id}
                            whileHover={{ scale: 1.02 }}
                            css={css`
                              background: #fff;
                              border-radius: 0.5rem;
                              box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
                              padding: 1rem;
                            `}
                          >
                            <h3 css={css`font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;`}>
                              {service.name}
                            </h3>
                            <p css={css`font-size: 0.875rem; color: #4b5563; margin-bottom: 0.5rem;`}>
                              {service.description}
                            </p>
                            <div css={css`display: flex; justify-content: space-between; font-size: 0.875rem; color: #6b7280;`}>
                              <span>{service.duration} minutes</span>
                              <span css={css`font-weight: 600; color: #10b981;`}>
                                {service.price.toLocaleString()} XAF
                              </span>
                            </div>
                            <div css={css`margin-top: 0.75rem; display: flex; gap: 0.5rem;`}>
                              <Link
                                to={`/expert/services/edit/${service.id}`}
                                css={css`
                                  background: #2563eb;
                                  padding: 0.5rem 0.75rem;
                                  border-radius: 0.375rem;
                                  color: #fff;
                                  text-align: center;
                                  flex: 1;
                                  transition: background 0.3s;
                                  &:hover { background: #1d4ed8; }
                                `}
                              >
                                Modifier
                              </Link>
                              <button
                                onClick={() => alert(`Supprimer le service ${service.id} (simulation)`)}
                                css={css`
                                  background: #ef4444;
                                  padding: 0.5rem 0.75rem;
                                  border-radius: 0.375rem;
                                  color: #fff;
                                  flex: 1;
                                  text-align: center;
                                  transition: background 0.3s;
                                  &:hover { background: #dc2626; }
                                `}
                              >
                                Supprimer
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p css={css`font-size: 1rem; color: #6b7280; font-weight: 500;`}>
                        Aucun service proposé pour l'instant.
                      </p>
                    )}
                  </motion.div>
                )}

                {selectedTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET SÉCURITÉ */}
                    <form
                      onSubmit={handleSecuritySave}
                      css={css`
                        display: grid;
                        gap: 1.5rem;
                      `}
                    >
                      <div>
                        <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                          `}
                        />
                      </div>
                      <div
                        css={css`
                          display: grid;
                          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
                          gap: 1.5rem;
                        `}
                      >
                        <div>
                          <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            css={css`
                              width: 100%;
                              padding: 0.75rem;
                              border: 1px solid #d1d5db;
                              border-radius: 0.375rem;
                              background: #f9fafb;
                              color: #111827;
                            `}
                          />
                        </div>
                        <div>
                          <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                            Confirmer le mot de passe
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            css={css`
                              width: 100%;
                              padding: 0.75rem;
                              border: 1px solid #d1d5db;
                              border-radius: 0.375rem;
                              background: #f9fafb;
                              color: #111827;
                            `}
                          />
                        </div>
                      </div>
                      <div css={css`display: flex; align-items: center; gap: 0.75rem;`}>
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                          css={css`
                            width: 1.25rem;
                            height: 1.25rem;
                            accent-color: #2563eb;
                          `}
                        />
                        <span css={css`font-size: 0.875rem; color: #4b5563;`}>
                          Activer la double authentification
                        </span>
                      </div>
                      <div css={css`text-align: right;`}>
                        <button
                          type="submit"
                          css={css`
                            background: #10b981;
                            color: white;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover { background: #059669; }
                          `}
                        >
                          Sauvegarder la sécurité
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {selectedTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET NOTIFICATIONS */}
                    <form
                      onSubmit={handleNotificationsSave}
                      css={css`
                        display: grid;
                        gap: 1.5rem;
                      `}
                    >
                      <div
                        css={css`
                          display: grid;
                          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
                          gap: 1.5rem;
                        `}
                      >
                        <div>
                          <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                            Notifications Email
                          </label>
                          <div css={css`display: flex; align-items: center; gap: 0.5rem;`}>
                            <input
                              type="checkbox"
                              checked={emailNotif}
                              onChange={(e) => setEmailNotif(e.target.checked)}
                              css={css`width: 1.25rem; height: 1.25rem; accent-color: #2563eb;`}
                            />
                            <select
                              value={emailFreq}
                              onChange={(e) => setEmailFreq(e.target.value)}
                              css={css`
                                padding: 0.5rem;
                                border: 1px solid #d1d5db;
                                border-radius: 0.375rem;
                              `}
                            >
                              <option value="immédiat">Immédiat</option>
                              <option value="quotidien">Quotidien</option>
                              <option value="hebdomadaire">Hebdomadaire</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div css={css`text-align: right;`}>
                        <button
                          type="submit"
                          css={css`
                            background: #10b981;
                            color: white;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover { background: #059669; }
                          `}
                        >
                          Sauvegarder les notifications
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {selectedTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET CONFIDENTIALITÉ */}
                    <form
                      onSubmit={handlePrivacySave}
                      css={css`
                        display: grid;
                        gap: 1.5rem;
                      `}
                    >
                      <div>
                        <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                          Visibilité du profil
                        </label>
                        <div css={css`display: flex; gap: 1rem;`}>
                          <label css={css`display: flex; align-items: center;`}>
                            <input
                              type="radio"
                              name="profileVisibility"
                              value="public"
                              checked={profileVisibility === 'public'}
                              onChange={() => setProfileVisibility('public')}
                              css={css`margin-right: 0.5rem;`}
                            />
                            Public
                          </label>
                          <label css={css`display: flex; align-items: center;`}>
                            <input
                              type="radio"
                              name="profileVisibility"
                              value="private"
                              checked={profileVisibility === 'private'}
                              onChange={() => setProfileVisibility('private')}
                              css={css`margin-right: 0.5rem;`}
                            />
                            Privé
                          </label>
                          <label css={css`display: flex; align-items: center;`}>
                            <input
                              type="radio"
                              name="profileVisibility"
                              value="custom"
                              checked={profileVisibility === 'custom'}
                              onChange={() => setProfileVisibility('custom')}
                              css={css`margin-right: 0.5rem;`}
                            />
                            Personnalisé
                          </label>
                        </div>
                      </div>
                      <div>
                        <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                          Qui peut voir votre email
                        </label>
                        <select
                          value={emailVisibility}
                          onChange={(e) => setEmailVisibility(e.target.value)}
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db;
                            border-radius: 0.375rem;
                          `}
                        >
                          <option value="everyone">Tout le monde</option>
                          <option value="friends">Amis seulement</option>
                          <option value="only-me">Moi uniquement</option>
                        </select>
                      </div>
                      <div css={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1.5rem;`}>
                        <div>
                          <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                            Langue
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            css={css`
                              width: 100%;
                              padding: 0.75rem;
                              border: 1px solid #d1d5db;
                              border-radius: 0.375rem;
                            `}
                          >
                            <option value="fr">Français</option>
                            <option value="en">Anglais</option>
                            <option value="es">Espagnol</option>
                          </select>
                        </div>
                        <div>
                          <label css={css`display: block; font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem;`}>
                            Thème
                          </label>
                          <div css={css`display: flex; gap: 1rem;`}>
                            <button
                              type="button"
                              onClick={() => setTheme('light')}
                              css={css`
                                padding: 0.75rem 1rem;
                                border-radius: 0.375rem;
                                background: ${theme === 'light' ? '#2563eb' : '#e5e7eb'} !important;
                                color: ${theme === 'light' ? '#fff' : '#111827'} !important;
                                transition: background 0.3s;
                              `}
                            >
                              <Sun size={18} css={css`margin-right: 0.5rem;`} />
                              Light
                            </button>
                            <button
                              type="button"
                              onClick={() => setTheme('dark')}
                              css={css`
                                padding: 0.75rem 1rem;
                                border-radius: 0.375rem;
                                background: ${theme === 'dark' ? '#2563eb' : '#e5e7eb'} !important;
                                color: ${theme === 'dark' ? '#fff' : '#111827'} !important;
                                transition: background 0.3s;
                              `}
                            >
                              <Moon size={18} css={css`margin-right: 0.5rem;`} />
                              Dark
                            </button>
                          </div>
                        </div>
                      </div>
                      <div css={css`text-align: right;`}>
                        <button
                          type="submit"
                          css={css`
                            background: #10b981 !important;
                            color: white !important;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover { background: #059669 !important; }
                          `}
                        >
                          Sauvegarder la confidentialité
                        </button>
                      </div>
                    </form>
                    {/* Comptes sociaux liés */}
                    <div css={css`margin-top: 1.5rem;`}>
                      <h3
                        css={css`
                          font-size: 1.125rem;
                          font-weight: 600;
                          color: #1f2937;
                          margin-bottom: 0.5rem;
                        `}
                      >
                        Comptes Sociaux Liés
                      </h3>
                      <div css={css`display: flex; gap: 1rem;`}>
                        {['facebook', 'google', 'twitter'].map((platform) => (
                          <div key={platform} css={css`display: flex; align-items: center; gap: 0.5rem;`}>
                            <img
                              src={`/icons/${platform}.svg`}
                              alt={platform}
                              css={css`width: 1.5rem; height: 1.5rem;`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setLinkedSocials((prev) => ({ ...prev, [platform]: false }))
                              }
                              css={css`color: #ef4444; text-decoration: underline;`}
                            >
                              Délier
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTab === 'activity' && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET ACTIVITÉ */}
                    <div css={css`display: grid; gap: 1rem;`}>
                      {activities.map((activity) => (
                        <div key={activity.id} css={css`
                          padding: 1rem;
                          background: #f3f4f6;
                          border-radius: 0.375rem;
                        `}>
                          <p css={css`color: #111827; font-weight: 600;`}>{activity.description}</p>
                          <p css={css`font-size: 0.75rem; color: #6b7280;`}>{activity.date}</p>
                        </div>
                      ))}
                      <div css={css`text-align: right;`}>
                        <button
                          type="button"
                          onClick={() => console.log('Rafraîchir les activités')}
                          css={css`
                            background: #2563eb !important;
                            color: white;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover { background: #1d4ed8 !important; }
                          `}
                        >
                          Rafraîchir
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTab === 'payments' && (
                  <motion.div
                    key="payments"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET PAIEMENTS */}
                    <div css={css`display: grid; gap: 1rem;`}>
                      {payments.map((payment) => (
                        <div key={payment.id} css={css`
                          padding: 1rem;
                          background: #f3f4f6;
                          border-radius: 0.375rem;
                          display: flex;
                          flex-direction: column;
                        `}>
                          <div css={css`
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          `}>
                            <span css={css`font-weight: 600; color: #111827;`}>
                              Facture {payment.invoice}
                            </span>
                            <span css={css`font-weight: 600; color: #10b981;`}>
                              {payment.amount.toLocaleString()} XAF
                            </span>
                          </div>
                          <div css={css`
                            margin-top: 0.5rem;
                            display: flex;
                            justify-content: space-between;
                          `}>
                            <span css={css`font-size: 0.75rem; color: #6b7280;`}>
                              {payment.date}
                            </span>
                            <span css={css`
                              font-size: 0.75rem;
                              color: ${payment.status === 'payé'
                                ? '#10b981'
                                : payment.status === 'en attente'
                                ? '#f59e0b'
                                : '#ef4444'};
                              font-weight: 600;
                            `}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div css={css`text-align: right;`}>
                        <button
                          type="button"
                          onClick={handleRefreshPayments}
                          css={css`
                            background: #2563eb;
                            color: white;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover { background: #1d4ed8; }
                          `}
                        >
                          Rafraîchir Paiements
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTab === 'statistics' && (
                  <motion.div
                    key="statistics"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET STATISTIQUES & AVIS */}
                    <div css={css`
                      display: flex;
                      flex-direction: column;
                      gap: 1rem;
                      align-items: center;
                      text-align: center;
                    `}>
                      <h2 css={css`
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: #111827;
                      `}>
                        Statistiques & Avis
                      </h2>
                      {statistics ? (
                        <div css={css`
                          display: grid;
                          grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
                          gap: 1rem;
                          width: 100%;
                        `}>
                          <div css={css`
                            background: #f3f4f6;
                            padding: 1rem;
                            border-radius: 0.375rem;
                          `}>
                            <p css={css`font-size: 0.875rem; color: #6b7280;`}>Rendez-vous</p>
                            <p css={css`font-size: 1.25rem; font-weight: 600; color: #111827;`}>{statistics.appointments}</p>
                          </div>
                          <div css={css`
                            background: #f3f4f6;
                            padding: 1rem;
                            border-radius: 0.375rem;
                          `}>
                            <p css={css`font-size: 0.875rem; color: #6b7280;`}>Avis</p>
                            <p css={css`font-size: 1.25rem; font-weight: 600; color: #111827;`}>{statistics.reviews}</p>
                          </div>
                          <div css={css`
                            background: #f3f4f6;
                            padding: 1rem;
                            border-radius: 0.375rem;
                          `}>
                            <p css={css`font-size: 0.875rem; color: #6b7280;`}>Note moyenne</p>
                            <p css={css`font-size: 1.25rem; font-weight: 600; color: #10b981;`}>{statistics.rating} / 5</p>
                          </div>
                        </div>
                      ) : (
                        <p css={css`color: #6b7280;`}>Aucune statistique disponible.</p>
                      )}
                      <Link
                        to={`/expert/statistics`}
                        css={css`
                          margin-top: 1rem;
                          display: inline-block;
                          background: #2563eb;
                          padding: 0.75rem 1.5rem;
                          border-radius: 0.375rem;
                          color: #fff;
                          transition: background 0.3s;
                          &:hover { background: #1d4ed8; }
                        `}
                      >
                        Voir plus de détails
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </Container>

    </ProfileWrapper>
  );
};

export default ExpertProfile;