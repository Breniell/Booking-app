/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, ChangeEvent } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShoppingBag, // Pour Commandes
  Star,        // Pour Favoris
} from 'lucide-react';

// --------------------------------------------------
// Isolation Wrapper pour contrer les styles globaux
// --------------------------------------------------
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
// Types
// -------------------------
interface UserProfile {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  createdAt?: string;
}

interface Payment {
  id: number;
  invoice: string;
  amount: number;
  date: string;
  status: 'payé' | 'en attente' | 'annulé';
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
}

interface Favorite {
  id: number;
  title: string;
  description: string;
}

// -------------------------
// Composant Principal
// -------------------------
const ClientProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Définition des onglets (8 onglets pour plus de fonctionnalités)
  type Tab = 'info' | 'security' | 'notifications' | 'privacy' | 'activity' | 'payments' | 'orders' | 'favorites';
  const [selectedTab, setSelectedTab] = useState<Tab>('info');

  // -------------------------
  // États pour l'onglet "Sécurité"
  // -------------------------
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // -------------------------
  // États pour "Notifications"
  // -------------------------
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailFreq, setEmailFreq] = useState('immédiat');
  const [smsFreq, setSmsFreq] = useState('quotidien');
  const [pushFreq, setPushFreq] = useState('immédiat');

  // -------------------------
  // États pour "Confidentialité"
  // -------------------------
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private' | 'custom'>('public');
  const [emailVisibility, setEmailVisibility] = useState<'everyone' | 'friends' | 'only-me'>('everyone');
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [linkedSocials, setLinkedSocials] = useState({
    facebook: true,
    google: false,
    twitter: true,
  });

  // -------------------------
  // États pour "Activité", "Paiements", "Commandes", "Favoris"
  // -------------------------
  const [activities, setActivities] = useState<Array<{ id: number; description: string; date: string }>>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const effectiveClientId = user?.id;

  useEffect(() => {
    if (!effectiveClientId) {
      console.error("Aucun identifiant de client n'a été fourni.");
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/clients/${effectiveClientId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        const fallbackProfile: UserProfile = {
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          username: (user?.firstName || 'john').toLowerCase() + '_' + (user?.lastName || 'doe').toLowerCase(),
          email: user?.email || 'john.doe@example.com',
          phone: '123-456-7890',
          address: '123 Rue Exemple, Ville, Pays',
          profileImage: '',
          createdAt: new Date().toISOString(),
        };
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Simuler Activité
    setActivities([
      { id: 1, description: 'Connexion réussie', date: '2025-04-01 10:00' },
      { id: 2, description: 'Profil mis à jour', date: '2025-04-02 14:30' },
      { id: 3, description: 'Changement de mot de passe', date: '2025-04-03 09:15' },
      { id: 4, description: 'Activation de la double authentification', date: '2025-04-04 16:45' },
      { id: 5, description: 'Export de données demandé', date: '2025-04-05 12:00' },
    ]);

    // Simuler Paiements
    setPayments([
      { id: 1, invoice: 'INV-001', amount: 10000, date: '2025-03-30', status: 'payé' },
      { id: 2, invoice: 'INV-002', amount: 25000, date: '2025-04-01', status: 'en attente' },
      { id: 3, invoice: 'INV-003', amount: 15000, date: '2025-04-03', status: 'annulé' },
    ]);

    // Simuler Commandes
    setOrders([
      { id: 1, orderNumber: 'ORD-1001', date: '2025-03-25', total: 50000, status: 'Expédié' },
      { id: 2, orderNumber: 'ORD-1002', date: '2025-03-28', total: 75000, status: 'En préparation' },
    ]);

    // Simuler Favoris
    setFavorites([
      { id: 1, title: 'Produit A', description: 'Description du produit A' },
      { id: 2, title: 'Produit B', description: 'Description du produit B' },
      { id: 3, title: 'Service C', description: 'Description du service C' },
    ]);
  }, [effectiveClientId, user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setProfile(prev =>
        prev ? { ...prev, profileImage: URL.createObjectURL(e.target.files[0]) } : prev
      );
    }
  };

  // -------------------------
  // Sauvegarde des sections
  // -------------------------
  const handleInfoSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingInfo(false);
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        await api.put(`/clients/${effectiveClientId}/upload-image`, formData);
      }
      await api.put(`/clients/${effectiveClientId}`, profile);
      console.log('Profil mis à jour avec succès', profile);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handleSecuritySave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    try {
      await api.put(`/clients/${effectiveClientId}/security`, {
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

  const handleNotificationsSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/clients/${effectiveClientId}/notifications`, {
        emailNotif,
        smsNotif,
        pushNotif,
        emailFreq,
        smsFreq,
        pushFreq,
      });
      console.log('Préférences de notifications mises à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications', error);
    }
  };

  const handlePrivacySave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/clients/${effectiveClientId}/privacy`, {
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

  const handleRefreshPayments = async () => {
    try {
      const response = await api.get(`/clients/${effectiveClientId}/payments`);
      setPayments(response.data);
      console.log('Paiements rafraîchis');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des paiements', error);
    }
  };

  const handleExportData = () => {
    alert("Demande d'export de données envoyée.");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      alert("Compte supprimé (simulation).");
    }
  };

  // Si en cours de chargement
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

  // Définir la liste des onglets
  const tabList: Array<{ id: Tab; label: string }> = [
    { id: 'info', label: 'Informations' },
    { id: 'security', label: 'Sécurité' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Confidentialité' },
    { id: 'activity', label: 'Activité' },
    { id: 'payments', label: 'Paiements' },
    { id: 'orders', label: 'Commandes' },
    { id: 'favorites', label: 'Favoris' },
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
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
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
                    {profile?.firstName.charAt(0)}
                    {profile?.lastName.charAt(0)}
                  </div>
                )}
              </div>
              {isEditingInfo && (
                <label
                  htmlFor="imageUpload"
                  css={css`
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: #fff !important;
                    border-radius: 50% !important;
                    padding: 0.5rem !important;
                    box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.25) !important;
                    cursor: pointer;
                  `}
                >
                  <Camera size={20} css={css`color: #2563eb;`} />
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    css={css`display: none;`}
                    onChange={handleImageChange}
                  />
                </label>
              )}
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
                    transition: background-color 0.3s;
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
                    {/* ONGLET INFORMATION */}
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
                          value={profile?.firstName}
                          onChange={(e) => isEditingInfo && handleChange(e)}
                          disabled={!isEditingInfo}
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid ${isEditingInfo ? '#2563eb' : '#d1d5db'} !important;
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
                          value={profile?.lastName}
                          onChange={(e) => isEditingInfo && handleChange(e)}
                          disabled={!isEditingInfo}
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid ${isEditingInfo ? '#2563eb' : '#d1d5db'} !important;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                          `}
                        />
                      </div>
                      <div css={css`grid-column: span 2;`}>
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
                          Nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={profile?.username || ''}
                          onChange={(e) => isEditingInfo && handleChange(e)}
                          disabled={!isEditingInfo}
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid ${isEditingInfo ? '#2563eb' : '#d1d5db'} !important;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                          `}
                        />
                      </div>
                      <div css={css`grid-column: span 2;`}>
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
                          Adresse Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile?.email}
                          disabled
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db !important;
                            border-radius: 0.375rem;
                            background: #e5e7eb;
                            color: #4b5563;
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
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile?.phone || ''}
                          onChange={(e) => isEditingInfo && handleChange(e)}
                          disabled={!isEditingInfo}
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid ${isEditingInfo ? '#2563eb' : '#d1d5db'} !important;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                          `}
                        />
                      </div>
                      <div css={css`grid-column: span 2;`}>
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
                          Adresse
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profile?.address || ''}
                          onChange={(e) => isEditingInfo && handleChange(e)}
                          disabled={!isEditingInfo}
                          css={css`
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid ${isEditingInfo ? '#2563eb' : '#d1d5db'} !important;
                            border-radius: 0.375rem;
                            background: #f9fafb;
                            color: #111827;
                          `}
                        />
                      </div>
                      <div
                        css={css`
                          grid-column: span 2;
                          display: flex;
                          justify-content: space-between;
                        `}
                      >
                        <button
                          type="button"
                          onClick={handleExportData}
                          css={css`
                            display: flex;
                            align-items: center;
                            background: #8b5cf6 !important;
                            color: white !important;
                            padding: 0.75rem 1rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover {
                              background: #7c3aed !important;
                            }
                          `}
                        >
                          <DownloadCloud size={18} css={css`margin-right: 0.5rem;`} />
                          Exporter mes données
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          css={css`
                            display: flex;
                            align-items: center;
                            background: #ef4444 !important;
                            color: white !important;
                            padding: 0.75rem 1rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover {
                              background: #dc2626 !important;
                            }
                          `}
                        >
                          <Trash2 size={18} css={css`margin-right: 0.5rem;`} />
                          Supprimer mon compte
                        </button>
                      </div>
                      <div css={css`grid-column: span 2; text-align: right;`}>
                        {isEditingInfo ? (
                          <>
                            <button
                              type="submit"
                              css={css`
                                background: #10b981 !important;
                                color: white !important;
                                padding: 0.75rem 1.5rem;
                                border-radius: 0.375rem;
                                transition: background 0.3s;
                                margin-right: 0.75rem;
                                &:hover {
                                  background: #059669 !important;
                                }
                              `}
                            >
                              Sauvegarder
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditingInfo(false)}
                              css={css`
                                background: #6b7280 !important;
                                color: white !important;
                                padding: 0.75rem 1.5rem;
                                border-radius: 0.375rem;
                                transition: background 0.3s;
                                &:hover {
                                  background: #4b5563 !important;
                                }
                              `}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingInfo(true)}
                            css={css`
                              display: flex;
                              align-items: center;
                              background: #2563eb !important;
                              color: white !important;
                              padding: 0.75rem 1.5rem;
                              border-radius: 0.375rem;
                              transition: background 0.3s;
                              &:hover {
                                background: #1d4ed8 !important;
                              }
                            `}
                          >
                            <Edit size={18} css={css`margin-right: 0.5rem;`} />
                            Modifier les informations
                          </button>
                        )}
                      </div>
                    </form>
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
                        <label
                          css={css`
                            display: block;
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                          `}
                        >
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
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
                      <div
                        css={css`
                          display: grid;
                          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
                          gap: 1.5rem;
                        `}
                      >
                        <div>
                          <label
                            css={css`
                              display: block;
                              font-size: 0.875rem;
                              font-weight: 600;
                              color: #4b5563;
                              margin-bottom: 0.25rem;
                            `}
                          >
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                              display: block;
                              font-size: 0.875rem;
                              font-weight: 600;
                              color: #4b5563;
                              margin-bottom: 0.25rem;
                            `}
                          >
                            Confirmer le mot de passe
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                      </div>
                      <div
                        css={css`
                          display: flex;
                          align-items: center;
                          gap: 0.75rem;
                        `}
                      >
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
                        <span
                          css={css`
                            font-size: 0.875rem;
                            color: #4b5563;
                          `}
                        >
                          Activer la double authentification
                        </span>
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
                            &:hover {
                              background: #059669 !important;
                            }
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
                          <label
                            css={css`
                              font-size: 0.875rem;
                              font-weight: 600;
                              color: #4b5563;
                              margin-bottom: 0.25rem;
                              display: block;
                            `}
                          >
                            Notifications Email
                          </label>
                          <div
                            css={css`
                              display: flex;
                              align-items: center;
                              gap: 0.5rem;
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={emailNotif}
                              onChange={(e) => setEmailNotif(e.target.checked)}
                              css={css`
                                width: 1.25rem;
                                height: 1.25rem;
                                accent-color: #2563eb;
                              `}
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
                            Notifications SMS
                          </label>
                          <div
                            css={css`
                              display: flex;
                              align-items: center;
                              gap: 0.5rem;
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={smsNotif}
                              onChange={(e) => setSmsNotif(e.target.checked)}
                              css={css`
                                width: 1.25rem;
                                height: 1.25rem;
                                accent-color: #2563eb;
                              `}
                            />
                            <select
                              value={smsFreq}
                              onChange={(e) => setSmsFreq(e.target.value)}
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
                            Notifications Push
                          </label>
                          <div
                            css={css`
                              display: flex;
                              align-items: center;
                              gap: 0.5rem;
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={pushNotif}
                              onChange={(e) => setPushNotif(e.target.checked)}
                              css={css`
                                width: 1.25rem;
                                height: 1.25rem;
                                accent-color: #2563eb;
                              `}
                            />
                            <select
                              value={pushFreq}
                              onChange={(e) => setPushFreq(e.target.value)}
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
                            background: #10b981 !important;
                            color: white !important;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover {
                              background: #059669 !important;
                            }
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
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
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
                        <label
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #4b5563;
                            margin-bottom: 0.25rem;
                            display: block;
                          `}
                        >
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
                          <label
                            css={css`
                              font-size: 0.875rem;
                              font-weight: 600;
                              color: #4b5563;
                              margin-bottom: 0.25rem;
                              display: block;
                            `}
                          >
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
                          <label
                            css={css`
                              font-size: 0.875rem;
                              font-weight: 600;
                              color: #4b5563;
                              margin-bottom: 0.25rem;
                              display: block;
                            `}
                          >
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
                              <Sun size={18} css={css`margin-right: 0.5rem;`} /> Light
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
                              <Moon size={18} css={css`margin-right: 0.5rem;`} /> Dark
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
                        <div css={css`display: flex; align-items: center; gap: 0.5rem;`}>
                          <img src="/icons/facebook.svg" alt="Facebook" css={css`width: 1.5rem; height: 1.5rem;`} />
                          <button
                            type="button"
                            onClick={() => setLinkedSocials(prev => ({ ...prev, facebook: false }))}
                            css={css`color: #ef4444; text-decoration: underline;`}
                          >
                            Délier
                          </button>
                        </div>
                        <div css={css`display: flex; align-items: center; gap: 0.5rem;`}>
                          <img src="/icons/google.svg" alt="Google" css={css`width: 1.5rem; height: 1.5rem;`} />
                          <button
                            type="button"
                            onClick={() => setLinkedSocials(prev => ({ ...prev, google: false }))}
                            css={css`color: #ef4444; text-decoration: underline;`}
                          >
                            Délier
                          </button>
                        </div>
                        <div css={css`display: flex; align-items: center; gap: 0.5rem;`}>
                          <img src="/icons/twitter.svg" alt="Twitter" css={css`width: 1.5rem; height: 1.5rem;`} />
                          <button
                            type="button"
                            onClick={() => setLinkedSocials(prev => ({ ...prev, twitter: false }))}
                            css={css`color: #ef4444; text-decoration: underline;`}
                          >
                            Délier
                          </button>
                        </div>
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
                    <div
                      css={css`
                        display: grid;
                        gap: 1rem;
                      `}
                    >
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          css={css`
                            padding: 1rem;
                            background: #f3f4f6;
                            border-radius: 0.375rem;
                          `}
                        >
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
                            color: white !important;
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
                    <div
                      css={css`
                        display: grid;
                        gap: 1rem;
                      `}
                    >
                      {payments.map((payment) => (
                        <div
                          key={payment.id}
                          css={css`
                            padding: 1rem;
                            background: #f3f4f6;
                            border-radius: 0.375rem;
                            display: flex;
                            flex-direction: column;
                          `}
                        >
                          <div
                            css={css`
                              display: flex;
                              justify-content: space-between;
                              align-items: center;
                            `}
                          >
                            <span css={css`font-weight: 600; color: #111827;`}>
                              Facture {payment.invoice}
                            </span>
                            <span css={css`font-weight: 600; color: #10b981;`}>
                              {payment.amount.toLocaleString()} XAF
                            </span>
                          </div>
                          <div
                            css={css`
                              margin-top: 0.5rem;
                              display: flex;
                              justify-content: space-between;
                            `}
                          >
                            <span css={css`font-size: 0.75rem; color: #6b7280;`}>
                              {payment.date}
                            </span>
                            <span
                              css={css`
                                font-size: 0.75rem;
                                color: ${payment.status === 'payé'
                                  ? '#10b981'
                                  : payment.status === 'en attente'
                                  ? '#f59e0b'
                                  : '#ef4444'};
                                font-weight: 600;
                              `}
                            >
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
                            background: #2563eb !important;
                            color: white !important;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.375rem;
                            transition: background 0.3s;
                            &:hover { background: #1d4ed8 !important; }
                          `}
                        >
                          Rafraîchir Paiements
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
                {selectedTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET COMMANDES */}
                    <div
                      css={css`
                        display: grid;
                        gap: 1rem;
                      `}
                    >
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          css={css`
                            padding: 1rem;
                            background: #f3f4f6;
                            border-radius: 0.375rem;
                          `}
                        >
                          <div css={css`display: flex; justify-content: space-between;`}>
                            <span css={css`font-weight: 600; color: #111827;`}>
                              Commande {order.orderNumber}
                            </span>
                            <span css={css`font-weight: 600; color: #10b981;`}>
                              {order.total.toLocaleString()} XAF
                            </span>
                          </div>
                          <div css={css`margin-top: 0.5rem; font-size: 0.75rem; color: #6b7280;`}>
                            {order.date} - {order.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {selectedTab === 'favorites' && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* ONGLET FAVORIS */}
                    <div
                      css={css`
                        display: grid;
                        gap: 1rem;
                      `}
                    >
                      {favorites.map((fav) => (
                        <div
                          key={fav.id}
                          css={css`
                            padding: 1rem;
                            background: #f3f4f6;
                            border-radius: 0.375rem;
                          `}
                        >
                          <h4 css={css`font-weight: 600; color: #111827;`}>
                            {fav.title}
                          </h4>
                          <p css={css`font-size: 0.875rem; color: #6b7280;`}>
                            {fav.description}
                          </p>
                        </div>
                      ))}
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

export default ClientProfile;