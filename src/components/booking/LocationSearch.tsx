import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader, AlertCircle } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (location: [number, number]) => void;
}

interface AddressResult {
  lat: number;
  lon: number;
  display_name: string;
}

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [error, setError] = useState('');

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr`
      );
      const data: AddressResult[] = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Address search error:', err);
      setError('Erreur lors de la recherche d\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocationError = (error: GeolocationPositionError) => {
    setGeolocating(false);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError('Veuillez autoriser l\'accès à votre position dans les paramètres de votre appareil');
        break;
      case error.POSITION_UNAVAILABLE:
        setError('Position indisponible. Vérifiez que la géolocalisation est activée sur votre appareil');
        break;
      case error.TIMEOUT:
        setError('Délai d\'attente dépassé. Veuillez réessayer');
        break;
      default:
        setError('Erreur de géolocalisation. Veuillez réessayer');
    }
  };

  const handleGeolocation = () => {
    setGeolocating(true);
    setError('');

    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      setGeolocating(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const successCallback = async (position: GeolocationPosition) => {
      try {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding pour obtenir l'adresse
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'adresse');
        }
        
        const data = await response.json();
        setAddress(data.display_name);
        onLocationSelect([latitude, longitude]);
      } catch (err) {
        console.error('Reverse geocoding error:', err);
        setError('Erreur lors de la récupération de l\'adresse');
      } finally {
        setGeolocating(false);
      }
    };

    // Demander la permission de géolocalisation
    navigator.permissions?.query({ name: 'geolocation' })
      .then((result) => {
        if (result.state === 'denied') {
          setError('L\'accès à votre position est bloqué. Veuillez l\'autoriser dans les paramètres de votre appareil');
          setGeolocating(false);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          successCallback,
          handleGeolocationError,
          options
        );
      })
      .catch(() => {
        // Si l'API permissions n'est pas supportée, on essaie directement la géolocalisation
        navigator.geolocation.getCurrentPosition(
          successCallback,
          handleGeolocationError,
          options
        );
      });
  };

  const selectAddress = (result: AddressResult) => {
    setAddress(result.display_name);
    onLocationSelect([result.lat, result.lon]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    return () => {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Entrez une adresse..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                searchAddress(e.target.value);
              }}
            />
            <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            {loading && (
              <Loader className="h-5 w-5 text-blue-500 absolute right-3 top-2.5 animate-spin" />
            )}
          </div>
          <button
            onClick={handleGeolocation}
            disabled={geolocating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center whitespace-nowrap"
          >
            {geolocating ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Navigation className="h-5 w-5 mr-2" />
                Me localiser
              </>
            )}
          </button>
        </div>

        {showSuggestions && addressSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
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

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};