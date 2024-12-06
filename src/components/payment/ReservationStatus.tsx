import React from 'react';
import { Check, Mail } from 'lucide-react';

interface ReservationStatusProps {
  reservationId: string;
  confirmationCode: string;
  onClose: () => void;
}

export const ReservationStatus = ({ reservationId, confirmationCode, onClose }: ReservationStatusProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full m-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Réservation confirmée !</h3>
          
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <Mail className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700">
              Un email de confirmation avec votre bon d'accès a été envoyé à votre adresse email.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Votre code de réservation :</p>
            <p className="text-xl font-mono font-bold text-gray-800">{confirmationCode}</p>
            <p className="text-xs text-gray-500 mt-2">
              Présentez ce code à l'établissement pour accéder aux services
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};