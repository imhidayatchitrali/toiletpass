import React, { useState, useEffect } from 'react';
import { 
  Wifi, Baby, Leaf, Shield, Dog, Coffee, Droplets, 
  Save, AlertCircle 
} from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';

export const FeatureManagement = () => {
  const { user } = useAuthContext();
  const [features, setFeatures] = useState({
    babyChange: false,
    wifi: false,
    eco: false,
    security: false,
    petFriendly: false,
    coffee: false,
    shower: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!user) return;

      try {
        const establishmentDoc = await getDoc(doc(db, 'establishments', user.uid));
        if (establishmentDoc.exists()) {
          setFeatures(establishmentDoc.data().features || {});
        }
      } catch (err) {
        console.error('Error fetching features:', err);
        setError('Impossible de charger les équipements');
      }
    };

    fetchFeatures();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateDoc(doc(db, 'establishments', user.uid), {
        features,
        updatedAt: new Date()
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating features:', err);
      setError('Impossible de mettre à jour les équipements');
    } finally {
      setLoading(false);
    }
  };

  const FeatureToggle = ({ 
    icon: Icon, 
    label, 
    name 
  }: { 
    icon: any; 
    label: string; 
    name: keyof typeof features;
  }) => (
    <label className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
      <input
        type="checkbox"
        checked={features[name]}
        onChange={(e) => setFeatures(prev => ({ ...prev, [name]: e.target.checked }))}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
      />
      <Icon className="h-5 w-5 text-gray-600 mr-2" />
      <span className="text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Gestion des équipements</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureToggle icon={Baby} label="Table à langer" name="babyChange" />
          <FeatureToggle icon={Wifi} label="Wi-Fi" name="wifi" />
          <FeatureToggle icon={Leaf} label="Écologique" name="eco" />
          <FeatureToggle icon={Shield} label="Sécurisé" name="security" />
          <FeatureToggle icon={Dog} label="Animaux acceptés" name="petFriendly" />
          <FeatureToggle icon={Coffee} label="Café" name="coffee" />
          <FeatureToggle icon={Droplets} label="Douche" name="shower" />
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
              Les équipements ont été mis à jour avec succès
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};