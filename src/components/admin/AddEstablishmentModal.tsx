import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, Loader, AlertCircle } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';

interface AddEstablishmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (establishment: any) => void;
}

interface AddressResult {
  lat: string;
  lon: string;
  display_name: string;
}

export const AddEstablishmentModal = ({ isOpen, onClose, onAdd }: AddEstablishmentModalProps) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    establishmentName: '',
    address: '',
    phone: '',
    description: '',
    features: {
      babyChange: false,
      wifi: false,
      eco: false,
      coffee: false,
      shower: false,
    }
  });
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    
    setGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr`
      );
      const data: AddressResult[] = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Address search error:', err);
    } finally {
      setGeocoding(false);
    }
  };

  const selectAddress = (result: AddressResult) => {
    setFormData(prev => ({ ...prev, address: result.display_name }));
    setCoordinates([parseFloat(result.lat), parseFloat(result.lon)]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !coordinates) return;

    setLoading(true);
    setError('');

    try {
      const establishmentId = Date.now().toString();
      const establishmentData = {
        ...formData,
        ownerId: user.uid,
        status: 'active',
        createdAt: new Date(),
        position: coordinates,
        type: 'partner',
        price: 2,
      };

      await setDoc(doc(db, 'establishments', establishmentId), establishmentData);
      onAdd({ id: establishmentId, ...establishmentData });
      onClose();
    } catch (err) {
      console.error('Error adding establishment:', err);
      setError(err instanceof Error ? err.message : 'Impossible d\'ajouter l\'établissement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter un établissement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'établissement
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="pl-10 w-full px-3 py-2 border rounded-md"
                value={formData.establishmentName}
                onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })}
              />
              <Building2 className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="pl-10 w-full px-3 py-2 border rounded-md"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  searchAddress(e.target.value);
                }}
              />
              <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              {geocoding && (
                <Loader className="h-5 w-5 text-blue-500 absolute right-3 top-2.5 animate-spin" />
              )}
            </div>
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {addressSuggestions.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                    onClick={() => selectAddress(result)}
                  >
                    {result.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                className="pl-10 w-full px-3 py-2 border rounded-md"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !coordinates}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};