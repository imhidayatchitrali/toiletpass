import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const profileCache = new Map<string, { data: ProfileData; timestamp: number }>();

export const useProfile = (user: User | null) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const cached = profileCache.get(user.uid);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setProfileData(cached.data);
          setLoading(false);
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = {
            ...profileData,
            ...userDoc.data(),
            email: user.email || ''
          } as ProfileData;
          
          setProfileData(data);
          profileCache.set(user.uid, {
            data,
            timestamp: Date.now()
          });
        } else {
          const newProfile = {
            firstName: '',
            lastName: '',
            email: user.email || '',
            phone: '',
            address: '',
            userId: user.uid,
            createdAt: new Date(),
          };
          
          await setDoc(userRef, newProfile);
          setProfileData(newProfile);
          profileCache.set(user.uid, {
            data: newProfile,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Impossible de charger le profil. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (newData: Partial<ProfileData>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Prepare update data with required fields
      const updateData = {
        ...newData,
        userId: user.uid,
        updatedAt: new Date(),
        email: user.email // Ensure email is always present
      };

      // Update Firestore
      await updateDoc(userRef, updateData);

      // Update local state and cache
      const updatedData = { ...profileData, ...newData };
      setProfileData(updatedData);
      profileCache.set(user.uid, {
        data: updatedData,
        timestamp: Date.now()
      });

      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw new Error('Impossible de mettre à jour le profil. Veuillez réessayer plus tard.');
    }
  };

  return { profileData, setProfileData, loading, error, updateProfile };
};