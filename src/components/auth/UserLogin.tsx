import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bath, Lock, User, Mail } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export const UserLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const createUserProfile = async (userId: string, data: any) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL: null,
        phone: '',
        address: ''
      });
    } catch (err) {
      console.error('Error creating user profile:', err);
      throw new Error('Erreur lors de la création du profil');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Vérifier que les champs requis sont remplis
        if (!formData.firstName || !formData.lastName) {
          throw new Error('Le prénom et le nom sont requis');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Créer le profil utilisateur
        await createUserProfile(userCredential.user.uid, formData);
      }
      navigate('/profile');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect');
      } else {
        setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Créer ou mettre à jour le profil avec les informations Google
        const names = result.user.displayName?.split(' ') || ['', ''];
        await createUserProfile(result.user.uid, {
          firstName: names[0],
          lastName: names.slice(1).join(' '),
          email: result.user.email,
        });
        navigate('/profile');
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Le popup de connexion a été bloqué. Veuillez autoriser les popups pour ce site et réessayer.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('La connexion a été annulée. Veuillez réessayer.');
      } else {
        setError('Erreur lors de la connexion avec Google. Veuillez réessayer.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Bath className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Connexion' : 'Inscription'}
        </h2>
        <div className="mt-2 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            ← Retour à l'accueil
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="text-sm">{error}</p>
              {error.includes('popup') && (
                <p className="text-xs mt-1">
                  Conseil: Vérifiez les paramètres de votre navigateur et autorisez les popups pour ce site.
                </p>
              )}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required={!isLogin}
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required={!isLogin}
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};