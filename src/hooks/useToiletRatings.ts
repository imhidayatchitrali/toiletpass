import { useState } from 'react';
import { doc, updateDoc, getDoc, setDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Rating {
  userId: string;
  rating: number;
  comment?: string;
  date: Date;
}

export const useToiletRatings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const checkReservationStatus = async (userId: string, toiletId: string) => {
  //   try {
  //     const reservationsQuery = query(
  //       collection(db, 'reservations'),
  //       where('userId', '==', userId),
  //       where('toiletId', '==', toiletId),
  //       where('status', '==', 'completed')
  //     );
      
  //     const querySnapshot = await getDocs(reservationsQuery);
  //     return !querySnapshot.empty;
  //   } catch (err) {
  //     console.error('Error checking reservation status:', err);
  //     return false;
  //   }
  // };

  const submitRating = async (
    toiletId: string, 
    userId: string, 
    rating: number, 
    comment?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const toiletRef = doc(db, 'toiletRatings', toiletId);
      const toiletDoc = await getDoc(toiletRef);

      const newRating: Rating = {
        userId,
        rating,
        comment,
        date: new Date()
      };

      if (!toiletDoc.exists()) {
        await setDoc(toiletRef, {
          ratings: [newRating],
          averageRating: rating,
          totalRatings: 1
        });
      } else {
        const data = toiletDoc.data();
        const ratings = data.ratings || [];
        
        const existingRating = ratings.find((r: Rating) => r.userId === userId);
        if (existingRating) {
          throw new Error('Vous avez déjà donné votre avis');
        }

        const newRatings = [...ratings, newRating];
        const averageRating = newRatings.reduce((acc, r) => acc + r.rating, 0) / newRatings.length;

        await updateDoc(toiletRef, {
          ratings: arrayUnion(newRating),
          averageRating,
          totalRatings: newRatings.length
        });
      }

      return true;
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err instanceof Error ? err.message : 'Impossible de soumettre votre avis');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getToiletRatings = async (toiletId: string) => {
    try {
      const toiletRef = doc(db, 'toiletRatings', toiletId);
      const toiletDoc = await getDoc(toiletRef);

      if (!toiletDoc.exists()) {
        return {
          ratings: [],
          averageRating: 0,
          totalRatings: 0
        };
      }

      return toiletDoc.data();
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Impossible de charger les avis');
      return null;
    }
  };

  return {
    submitRating,
    getToiletRatings,
    loading,
    error
  };
};