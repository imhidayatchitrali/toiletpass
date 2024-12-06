import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';

interface PaymentData {
  toiletId: string;
  amount: number;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  paymentMethod: 'wallet' | 'card';
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const processPayment = async ({
    toiletId,
    amount,
    establishmentId,
    establishmentName,
    establishmentAddress,
    paymentMethod
  }: PaymentData) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setLoading(true);
    setError(null);

    try {
      // Générer un code de confirmation unique
      const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Créer la réservation
      const reservationRef = await addDoc(collection(db, 'reservations'), {
        toiletId,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Utilisateur',
        amount,
        status: 'validated',
        timestamp: serverTimestamp(),
        confirmationCode,
        establishmentId,
        establishmentName,
        establishmentAddress,
        paymentMethod,
        qrCode: `${toiletId}-${confirmationCode}`
      });

      // Envoyer l'email avec le bon d'accès
      const sendAccessTicket = httpsCallable(functions, 'sendAccessTicket');
      await sendAccessTicket({
        reservationId: reservationRef.id,
        userEmail: user.email,
        userName: user.displayName || 'Utilisateur',
        amount,
        confirmationCode,
        timestamp: new Date().toISOString(),
        establishmentName,
        establishmentAddress
      });

      return {
        reservationId: reservationRef.id,
        confirmationCode
      };
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du paiement';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading,
    error,
  };
};