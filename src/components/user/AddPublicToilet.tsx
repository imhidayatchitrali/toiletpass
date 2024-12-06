import React, { useState } from 'react';
import { MapPin, Plus, Info, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePublicToilets } from '../../hooks/usePublicToilets';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AddressResult {
  lat: number;
  lon: number;
  display_name: string;
}

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export const AddPublicToilet = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { remainingCount, canAdd, incrementCount } = usePublicToilets(user?.uid || null);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr`
      );
      const data: AddressResult[] = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Address search error:', err);
    }
  };

  const selectAddress = (result: AddressResult) => {
    setAddress(result.display_name);
    setSelectedPosition([parseFloat(result.lat), parseFloat(result.lon)]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition || !user || !canAdd) return;

    setLoading(true);
    setError('');

    try {
      const success = await incrementCount();
      if (!success) {
        throw new Error('Vous avez atteint la limite quotidienne d\'ajouts');
      }

      // Ici, ajoutez la logique pour sauvegarder les toilettes dans Firestore
      // Pour l'exemple, on simule juste un délai
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Ajouter des toilettes publiques</h1>
                <div className="bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-sm text-blue-600">
                    {remainingCount} ajout{remainingCount > 1 ? 's' : ''} restant{remainingCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Vous pouvez ajouter jusqu'à 3 toilettes publiques gratuites par jour. 
                  Assurez-vous que l'emplacement est correct et que les toilettes sont réellement accessibles au public.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du lieu
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Toilettes Jardin des Tuileries"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-md pl-10"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        searchAddress(e.target.value);
                      }}
                      placeholder="Rechercher une adresse..."
                    />
                    <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
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
                    Description (facultatif)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajoutez des informations utiles sur l'accès..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position sur la carte
                  </label>
                  <div className="h-[400px] rounded-lg overflow-hidden border">
                    <MapContainer
                      center={[48.8566, 2.3522]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <MapClickHandler onLocationSelect={setSelectedPosition} />
                      {selectedPosition && (
                        <Marker position={selectedPosition} />
                      )}
                    </MapContainer>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Cliquez sur la carte pour définir l'emplacement exact
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedPosition || !canAdd}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        Ajout en cours...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Ajouter ces toilettes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};