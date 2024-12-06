import React from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, AlertCircle } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const StripePaymentForm = ({ amount, onSuccess, onError }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { paymentIntent, error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/reservations?success=true`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Payer {amount}€
          </>
        )}
      </button>
    </form>
  );
};