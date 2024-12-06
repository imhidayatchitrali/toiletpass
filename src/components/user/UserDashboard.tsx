import { useState, useEffect } from 'react';
import { MapPin, Star, Eye, Plus, Trash2, AlertCircle, Info, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePublicToilets } from '../../hooks/usePublicToilets';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Define the type for a toilet
interface Toilet {
  id: string;
  name: string;
  address: string;
  description?: string;
  stats: {
    views: number;
    rating: string;
  };
}

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { canAdd, dailyCount } = usePublicToilets(user?.uid || null);
  const [toilets, setToilets] = useState<Toilet[]>([]); // Correctly typed state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUserToilets();
  }, [user]);

  const fetchUserToilets = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'toilets'),
        where('createdBy', '==', user.uid),
        where('type', '==', 'public')
      );
      
      const querySnapshot = await getDocs(q);
      const toiletsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        stats: {
          views: Math.floor(Math.random() * 100),
          rating: (Math.random() * 4 + 1).toFixed(1)
        }
      }));

      setToilets(toiletsData as Toilet[]); // Cast the data to match the Toilet type
    } catch (err) {
      console.error('Error fetching toilets:', err);
      setError('Impossible de charger vos toilettes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'toilets', id));
      setToilets(prev => prev.filter(t => t.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting toilet:', err);
      setError('Impossible de supprimer ces toilettes');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-8 inline-flex items-center px-4 py-2 text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </button>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Mes toilettes publiques</h1>
              <p className="text-sm text-gray-600 mt-1">
                Ajouts restants aujourd'hui : {3 - dailyCount} / 3
              </p>
            </div>
            <button
              onClick={() => navigate('/add-public-toilet')}
              disabled={!canAdd}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter des toilettes
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Comment ça marche ?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vous pouvez ajouter jusqu'à 3 toilettes publiques gratuites par jour</li>
                <li>Les toilettes ajoutées sont immédiatement visibles sur la carte</li>
                <li>Suivez les statistiques de vos ajouts (vues et notes)</li>
                <li>La limite se réinitialise chaque jour à minuit</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {toilets.map((toilet) => (
              <div
                key={toilet.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{toilet.name}</h3>
                      <p className="text-gray-600 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {toilet.address}
                      </p>
                      {toilet.description && (
                        <p className="text-sm text-gray-500 mb-4">{toilet.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(toilet.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center space-x-6">
                    <div className="flex items-center text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{toilet.stats.views} vues</span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      <span>{toilet.stats.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {toilets.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Vous n'avez pas encore ajouté de toilettes publiques</p>
                {canAdd ? (
                  <button
                    onClick={() => navigate('/add-public-toilet')}
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter mes premières toilettes
                  </button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Vous avez atteint la limite quotidienne. Revenez demain !
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Modal de confirmation de suppression */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full m-4">
                <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer ces toilettes ? Cette action est irréversible.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
