import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useReservationStatus = (reservationId: string | null) => {
  const [status, setStatus] = useState<'pending' | 'validated' | 'rejected' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'reservations', reservationId),
      (doc) => {
        if (doc.exists()) {
          setStatus(doc.data().status);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Reservation status error:', err);
        setError('Impossible de suivre le statut de la réservation');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [reservationId]);

  return { status, loading, error };
};