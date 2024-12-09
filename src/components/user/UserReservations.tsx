import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, MapPin, Euro, AlertCircle, Search, QrCode, X } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import QRCodeDisplay from 'react-qr-code';

interface Reservation {
  id: string;
  userId: string;
  toiletId: string;
  amount: number;
  status: 'validated' | 'completed' | 'cancelled';
  timestamp: Date;
  confirmationCode: string;
  establishmentName: string;
  establishmentAddress: string;
  qrCode: string;
}

export const UserReservations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    if (!user) return;

    try {
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(reservationsQuery);
      const reservationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Reservation[];
      
      setReservations(reservationsData);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading your reservations. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.establishmentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Mes Réservations</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </button>
          </div>

          {location.state?.newReservation && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Votre réservation a été confirmée ! Vous trouverez ci-dessous votre QR code d'accès.
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher un établissement..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <div className="sm:w-48">
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="validated">Validées</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center mb-6">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {reservation.establishmentName}
                      </h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {reservation.establishmentAddress}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reservation.status === 'validated' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reservation.status === 'validated' ? 'Validée' :
                       reservation.status === 'completed' ? 'Terminée' :
                       'Annulée'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {reservation.timestamp.toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Euro className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {reservation.amount}€
                      </span>
                    </div>
                  </div>

                  {reservation.status === 'validated' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">Code d'accès :</p>
                        <button
                          onClick={() => setShowQRCode(reservation.qrCode)}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <QrCode className="h-5 w-5 mr-1" />
                          Voir QR Code
                        </button>
                      </div>
                      <p className="font-mono text-lg font-bold text-gray-900">
                        {reservation.confirmationCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredReservations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune réservation trouvée</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal QR Code */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code d'accès</h3>
              <button onClick={() => setShowQRCode(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <QRCodeDisplay value={showQRCode} />
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">
              Présentez ce QR code à l'établissement pour accéder aux services
            </p>
            <button
              onClick={() => setShowQRCode(null)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
