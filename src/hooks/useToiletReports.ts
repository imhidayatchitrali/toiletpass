import { useState } from 'react';
import { doc, updateDoc, getDoc, setDoc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const REPORT_THRESHOLD = 5; // Nombre de signalements avant suppression

export const useToiletReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportToilet = async (toiletId: string) => {
    setLoading(true);
    setError(null);

    try {
      const reportRef = doc(db, 'toiletReports', toiletId);
      const reportDoc = await getDoc(reportRef);

      if (!reportDoc.exists()) {
        // Premier signalement
        await setDoc(reportRef, {
          reportCount: 1,
          lastReportDate: new Date()
        });
      } else {
        const currentCount = reportDoc.data().reportCount;
        
        if (currentCount + 1 >= REPORT_THRESHOLD) {
          // Supprimer les toilettes si le seuil est atteint
          await deleteDoc(doc(db, 'toilets', toiletId));
          await deleteDoc(reportRef);
          return { deleted: true };
        }

        await updateDoc(reportRef, {
          reportCount: increment(1),
          lastReportDate: new Date()
        });
      }

      return { deleted: false };
    } catch (err) {
      console.error('Error reporting toilet:', err);
      setError('Impossible de signaler ces toilettes. Veuillez réessayer.');
      return { deleted: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    reportToilet,
    loading,
    error
  };
};