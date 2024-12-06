import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

interface PaymentData {
  amount: number;
  toiletId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
}


export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (data: PaymentData) => {
    setLoading(true);
    setError(null);

    try {
      const createPayment = httpsCallable(functions, 'createPayment');
      
      // No need for type assertion since TypeScript infers the type correctly
      const result = await createPayment(data);

      // Check if the result.data exists and is an object (not a primitive)
      if (result.data && typeof result.data === 'object' && 'checkoutUrl' in result.data) {
        return result.data as { checkoutUrl: string };
      } else {
        throw new Error('Impossible de créer l\'intention de paiement');
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaymentIntent,
    loading,
    error,
    setError
  };
};
