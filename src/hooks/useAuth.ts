import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Vérifier si le profil existe déjà
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);
        
        if (!snapshot.exists()) {
          // Créer le profil s'il n'existe pas
          await createUserProfile(user);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUserProfile = async (user: User, additionalData?: any) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const { email, displayName, photoURL } = user;
      const createdAt = new Date();
      const names = displayName?.split(' ') || ['', ''];

      await setDoc(userRef, {
        email,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        photoURL: photoURL || '',
        createdAt,
        updatedAt: createdAt,
        ...additionalData
      });

      // Créer le wallet pour l'utilisateur
      const walletRef = doc(db, 'wallets', user.uid);
      await setDoc(walletRef, {
        balance: 0,
        userId: user.uid,
        createdAt,
        updatedAt: createdAt
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Erreur lors de la création du profil');
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      // Configurer la persistance locale
      await setPersistence(auth, browserLocalPersistence);

      // Configurer le provider Google
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Utiliser le resolver de popup explicite
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      
      // Vérifier si le profil existe
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Créer le profil si c'est un nouvel utilisateur
        await createUserProfile(result.user);
      }

      return result.user;
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code === 'auth/popup-blocked') {
        setError('Le popup de connexion a été bloqué. Veuillez autoriser les popups pour ce site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('La connexion a été annulée.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('La fenêtre de connexion a été fermée. Veuillez réessayer.');
      } else {
        setError('Erreur lors de la connexion avec Google');
      }
      throw error;
    }
  };

  // ... reste du code inchangé ...

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
};