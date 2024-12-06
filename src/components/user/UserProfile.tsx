import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, Calendar, Wallet, Home, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { ProfilePhoto } from './ProfilePhoto';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { profileData, setProfileData, loading, error: profileError, updateProfile } = useProfile(user);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      if (!profileData.firstName || !profileData.lastName) {
        throw new Error('Le prénom et le nom sont requis');
      }

      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (profileData.phone && !phoneRegex.test(profileData.phone)) {
        throw new Error('Le numéro de téléphone n\'est pas valide');
      }

      const updatedData = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        phone: profileData.phone.trim(),
        address: profileData.address.trim(),
      };

      await updateProfile(updatedData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setEmailError('');
    setSaving(true);

    try {
      // Vérifier que le nouvel email est différent
      if (emailData.newEmail === user.email) {
        throw new Error('Le nouvel email doit être différent de l\'actuel');
      }

      // Valider le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailData.newEmail)) {
        throw new Error('Format d\'email invalide');
      }

      // Réauthentifier l'utilisateur
      const credential = EmailAuthProvider.credential(
        user.email!,
        emailData.password
      );
      await reauthenticateWithCredential(user, credential);

      // Mettre à jour l'email
      await updateEmail(user, emailData.newEmail);

      // Mettre à jour le profil
      await updateProfile({ ...profileData, email: emailData.newEmail });

      setShowEmailModal(false);
      setEmailData({ newEmail: '', password: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Email update error:', err);
      if (err.code === 'auth/wrong-password') {
        setEmailError('Mot de passe incorrect');
      } else if (err.code === 'auth/email-already-in-use') {
        setEmailError('Cet email est déjà utilisé');
      } else {
        setEmailError(err.message || 'Erreur lors de la mise à jour de l\'email');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpdate = (photoURL: string | null) => {
    setProfileData(prev => ({ ...prev, photoURL }));
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    type = "text", 
    value, 
    onChange, 
    disabled = false, 
    required = false,
    placeholder = "",
    onEditClick = undefined
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`pl-10 w-full h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm ${
            disabled ? 'bg-gray-50' : ''
          }`}
        />
        {onEditClick && (
          <button
            type="button"
            onClick={onEditClick}
            className="absolute right-3 px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
          >
            Modifier
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="absolute -bottom-12 left-8">
                <ProfilePhoto
                  userId={user?.uid || ''}
                  currentPhotoURL={profileData.photoURL}
                  onPhotoUpdate={handlePhotoUpdate}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="pt-16 px-8 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{profileData.email}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center px-3 py-1 bg-green-50 rounded-full">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-green-700">Compte vérifié</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-blue-700">
                    Membre depuis {new Date(user?.metadata.creationTime || '').getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Wallet className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ma Cagnotte</h3>
                    <p className="text-2xl font-bold text-purple-600">{walletBalance.toFixed(2)}€</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/wallet')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Gérer ma cagnotte
                </button>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="Prénom"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  required
                />

                <InputField
                  icon={User}
                  label="Nom"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  required
                />

                <InputField
                  icon={Mail}
                  label="Email"
                  type="email"
                  value={profileData.email}
                  disabled
                  onEditClick={() => setShowEmailModal(true)}
                />

                <InputField
                  icon={Phone}
                  label="Téléphone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                />

                <div className="md:col-span-2">
                  <InputField
                    icon={MapPin}
                    label="Adresse"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    placeholder="123 rue Example, 75000 Paris"
                  />
                </div>
              </div>

              {/* Error and Success Messages */}
              {(error || profileError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error || profileError}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600">Profil mis à jour avec succès</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de modification d'email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
            <h3 className="text-lg font-semibold mb-4">Modifier mon email</h3>
            
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouvel email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                  placeholder="nouveau@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={emailData.password}
                  onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                  placeholder="Votre mot de passe"
                />
              </div>

              {emailError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {emailError}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailData({ newEmail: '', password: '' });
                    setEmailError('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Modification...' : 'Modifier mon email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};