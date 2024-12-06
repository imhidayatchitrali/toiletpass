import React from 'react';
import { QrCode, Check, X } from 'lucide-react';

export const QrScanner = () => {
  const [scanResult, setScanResult] = React.useState<string | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  // Simulate QR code scanning
  const handleScanClick = () => {
    // In a real application, this would use the device's camera
    setScanResult('reservation-123');
    setShowResult(true);
  };

  const handleValidate = () => {
    // Handle validation logic here
    setShowResult(false);
    setScanResult(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scanner QR Code</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center">
          {!showResult ? (
            <>
              <div className="mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">
                  Cliquez sur le bouton ci-dessous pour scanner un QR code
                </p>
                <button
                  onClick={handleScanClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  Scanner un QR code
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium">Réservation trouvée</p>
                <p className="text-gray-600">ID: {scanResult}</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleValidate}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Valider l'accès
                </button>
                <button
                  onClick={() => setShowResult(false)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Refuser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Derniers accès validés</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Jean Dupont</p>
              <p className="text-sm text-gray-600">15 Mars 2024, 14:30</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Validé
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Marie Martin</p>
              <p className="text-sm text-gray-600">15 Mars 2024, 13:45</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Validé
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};