import React from 'react';
import { Building2, Euro, MapPin, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const EstablishmentSection = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isPartner, setIsPartner] = React.useState(false);

  React.useEffect(() => {
    const checkPartnerStatus = async () => {
      if (!user) {
        setIsPartner(false);
        return;
      }

      try {
        const establishmentQuery = query(
          collection(db, 'establishments'),
          where('ownerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(establishmentQuery);
        setIsPartner(!querySnapshot.empty);
      } catch (err) {
        console.error('Error checking partner status:', err);
        setIsPartner(false);
      }
    };

    checkPartnerStatus();
  }, [user]);

  const handlePartnerClick = () => {
    if (isPartner) {
      navigate('/admin');
    } else {
      navigate('/partner-login');
    }
  };

  return (
    <div id="partner" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Devenez Partenaire</h2>
          <p className="text-lg text-gray-600 mb-8">
            Rentabilisez vos installations sanitaires en les proposant sur ToiletPass
          </p>
          <button
            onClick={handlePartnerClick}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            {isPartner ? 'Accéder à mon espace partenaire' : 'Devenir partenaire'}
          </button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Revenus Supplémentaires</h3>
            <p className="text-gray-600">Générez des revenus additionnels en proposant vos installations sanitaires</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visibilité Accrue</h3>
            <p className="text-gray-600">Attirez de nouveaux clients potentiels vers votre établissement</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestion Simplifiée</h3>
            <p className="text-gray-600">Gérez facilement vos réservations et vos tarifs depuis notre plateforme</p>
          </div>
        </div>
      </div>
    </div>
  );
};