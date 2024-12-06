import React, { useState, useEffect } from 'react';
import { Euro, Save, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '../../contexts/AuthContext';

export const PriceManagement = () => {
  const { user } = useAuthContext();
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      if (!user) return;
      
      try {
        const establishmentDoc = await getDoc(doc(db, 'establishments', user.uid));
        if (establishmentDoc.exists()) {
          setPrice(establishmentDoc.data().price || '');
        }
      } catch (err) {
        console.error('Error fetching price:', err);
      }
    };

    fetchCurrentPrice();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Le prix doit être un nombre positif');
      }

      await updateDoc(doc(db, 'establishments', user.uid), {
        price: priceValue,
        updatedAt: new Date()
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Gestion des prix</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix par utilisation
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Euro className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0.50"
              step="0.50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">EUR</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Définissez le prix que vous souhaitez facturer par utilisation
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">
              Le prix a été mis à jour avec succès
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            'Mise à jour...'
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Enregistrer le nouveau prix
            </>
          )}
        </button>
      </form>
    </div>
  );
};