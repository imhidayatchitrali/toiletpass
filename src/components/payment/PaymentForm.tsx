import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, STRIPE_OPTIONS } from '../../config/stripe';
import { StripeService } from '../../services/stripe.service';
import { StripePaymentForm } from './StripePaymentForm';
import { AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  toiletId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  toiletId,
  establishmentId,
  establishmentName,
  establishmentAddress,
  onSuccess,
  onError,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        const { clientSecret } = await StripeService.createPaymentIntent({
          amount,
          toiletId,
          establishmentId,
          establishmentName,
          establishmentAddress,
        });
        setClientSecret(clientSecret);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(message);
        onError(message);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [amount, toiletId, establishmentId, establishmentName, establishmentAddress]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, ...STRIPE_OPTIONS }}>
      <StripePaymentForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};