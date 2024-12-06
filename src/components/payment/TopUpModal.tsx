import React, { useState } from 'react';
import { X, Wallet, AlertCircle, CreditCard } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../config/stripe';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';
import { StripePaymentForm } from './StripePaymentForm';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export const TopUpModal = ({ isOpen, onClose, onSuccess }: TopUpModalProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value || '0') <= 100) {
      setAmount(value);
    }
  };

  const initializePayment = async () => {
    if (!amount || parseFloat(amount) < 5) {
      setError('Le montant minimum est de 5€');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
      // Cast result as unknown first, then cast to the expected type
      const result = await createPaymentIntent({ amount: parseFloat(amount) }) as unknown as CreatePaymentIntentResponse;
      setClientSecret(result.clientSecret); // Now the clientSecret is safely accessed
    } catch (err) {
      console.error('Error initializing payment:', err);
      setError('Erreur lors de l\'initialisation du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Wallet className="h-6 w-6 text-blue-600 mr-2" />
            Recharger ma cagnotte
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {!clientSecret ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant à recharger (€)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Montant (min: 5€, max: 100€)"
                />
                <span className="absolute right-3 top-2 text-gray-400">€</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value.toString())}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                >
                  {value}€
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={initializePayment}
              disabled={loading || !amount || parseFloat(amount) < 5}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {loading ? 'Chargement...' : 'Continuer'}
            </button>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm
              amount={parseFloat(amount)}
              onSuccess={onSuccess}
              onError={setError}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};
