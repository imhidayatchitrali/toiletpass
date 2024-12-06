import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { X } from 'lucide-react';
import { StripePaymentForm } from './StripePaymentForm';

const stripePromise = loadStripe('pk_test_51QJyZwRsucNItIWPHzrCljdjgcMapcKG1bOHALri2mc5l11ziVjMGtEZmnWupmkbZbXQNRd6A5Qnym40ThbnQfKm00U4ZWRWaz');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  amount: number;
}

export const PaymentModal = ({ isOpen, onClose, clientSecret, amount }: PaymentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Paiement sécurisé</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <Elements stripe={stripePromise} options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#2563eb',
            },
          },
          locale: 'fr'
        }}>
          <StripePaymentForm
            amount={amount}
            onSuccess={() => {
              window.location.href = '/reservations?success=true';
            }}
            onError={(error) => console.error('Payment error:', error)}
          />
        </Elements>
      </div>
    </div>
  );
};