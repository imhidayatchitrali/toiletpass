import { useState, useEffect } from 'react';
import { Building2, MapPin, Euro, TrendingUp, Trash2, Calendar, AlertCircle, Edit } from 'lucide-react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import { EditEstablishmentModal } from './EditEstablishmentModal';

// Define the Establishment type
interface Establishment {
  id: string;
  establishmentName: string;
  address: string;
  createdAt: any; // Firestore timestamp
  revenue?: {
    daily: number;
    monthly: number;
    total: number;
  };
  ownerId: string;
}

export const EstablishmentsList = () => {
  const { user } = useAuthContext();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);

  useEffect(() => {
    fetchEstablishments();
  }, [user]);

  const fetchEstablishments = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'establishments'),
        where('ownerId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const establishmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Establishment[];

      setEstablishments(establishmentsData);
    } catch (err) {
      console.error('Error fetching establishments:', err);
      setError('Impossible de charger vos établissements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'establishments', id));
      setEstablishments(prev => prev.filter(e => e.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting establishment:', err);
      setError('Impossible de supprimer l\'établissement');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (establishment: Establishment) => {
    setEditingEstablishment(establishment);
  };

  const handleUpdateEstablishment = (updatedEstablishment: Establishment) => {
    setEstablishments(prev =>
      prev.map(est =>
        est.id === updatedEstablishment.id ? updatedEstablishment : est
      )
    );
    setEditingEstablishment(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <Building2 className="h-6 w-6 mr-2 text-blue-600" />
        Mes Établissements
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {establishments.map((establishment) => (
          <div 
            key={establishment.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {establishment.establishmentName}
                  </h3>
                  <p className="text-gray-600 flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {establishment.address}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Ajouté le {formatDate(establishment.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(establishment)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(establishment.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Aujourd'hui</span>
                    <Euro className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold">{establishment.revenue?.daily || 0}€</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Ce mois</span>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold">{establishment.revenue?.monthly || 0}€</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total</span>
                    <Euro className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-lg font-semibold">{establishment.revenue?.total || 0}€</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {establishments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Vous n'avez pas encore d'établissement</p>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full m-4">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet établissement ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={deleteLoading}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingEstablishment && (
        <EditEstablishmentModal
          establishment={editingEstablishment}
          onClose={() => setEditingEstablishment(null)}
          onUpdate={handleUpdateEstablishment}
        />
      )}
    </div>
  );
};
