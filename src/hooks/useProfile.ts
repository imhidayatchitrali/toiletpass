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
    email: user?.email || '',  // Initialize with user email
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const cached = profileCache.get(user.uid);
        // Check if the cache is available and valid
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setProfileData(cached.data);
          setLoading(false);
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data: ProfileData = {
            firstName: userDoc.data().firstName || '',
            lastName: userDoc.data().lastName || '',
            email: user.email || '',
            phone: userDoc.data().phone || '',
            address: userDoc.data().address || '',
          };
          
          setProfileData(data);
          profileCache.set(user.uid, {
            data,
            timestamp: Date.now()
          });
        } else {
          // Handle case where profile does not exist, create new profile
          const newProfile: ProfileData = {
            firstName: '',
            lastName: '',
            email: user.email || '',
            phone: '',
            address: '',
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
  }, [user]); // Only re-fetch if the `user` object changes

  const updateProfile = async (newData: Partial<ProfileData>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Prepare update data with required fields
      const updateData = {
        ...newData,
        updatedAt: new Date(),  // Timestamp the update
        email: user.email, // Ensure email is always present
      };

      // Update Firestore with the new data
      await updateDoc(userRef, updateData);

      // Update the local state and cache
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
