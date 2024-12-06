import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../lib/firebase';

export const useProfilePhoto = (userId: string) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = async (file: File) => {
    if (!userId) {
      setError('Utilisateur non connecté');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image ne doit pas dépasser 5 Mo');
      }

      // Create a unique filename using timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}-${randomString}`;
      
      const storageRef = ref(storage, `users/${userId}/profile/${filename}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL with a token
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update user profile with the new URL
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date()
      });

      return downloadURL;
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement de la photo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoURL: string) => {
    if (!userId || !photoURL) {
      setError('Impossible de supprimer la photo');
      return false;
    }

    try {
      // Extract the storage path from the URL
      const photoPath = photoURL.split('/o/')[1].split('?')[0];
      const decodedPath = decodeURIComponent(photoPath);
      const photoRef = ref(storage, decodedPath);
      
      // Delete the photo
      await deleteObject(photoRef);

      // Update user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL: null,
        updatedAt: new Date()
      });

      return true;
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la photo');
      return false;
    }
  };

  return {
    uploadPhoto,
    deletePhoto,
    uploading,
    error
  };
};