import React, { useState } from 'react';
import { X, Phone, Shield, Loader } from 'lucide-react';
import { useEstablishmentVerification } from '../../hooks/useEstablishmentVerification';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userId: string;
}

export const VerificationModal = ({ isOpen, onClose, onVerified, userId }: VerificationModalProps) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const { sendVerificationCode, verifyCode, loading, error } = useEstablishmentVerification();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendVerificationCode(phone);
    if (success) {
      setStep('code');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyCode(phone, code, userId);
    if (success) {
      onVerified();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            Vérification de l'établissement
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone de l'établissement
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  className="pl-10 w-full px-3 py-2 border rounded-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
                <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Un code de vérification sera envoyé à ce numéro
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !phone}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Envoyer le code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code de vérification
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
              <p className="mt-2 text-sm text-gray-500">
                Entrez le code reçu par SMS
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading || !code}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  'Vérifier'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};