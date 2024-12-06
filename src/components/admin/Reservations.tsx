import React from 'react';
import { Search, Filter, Check, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';

export const Reservations = () => {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [showQRCode, setShowQRCode] = React.useState(false);
  const [selectedReservation, setSelectedReservation] = React.useState(null);
  const [reservations, setReservations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'reservations'),
          where('establishmentId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const reservationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setReservations(reservationsData);
      } catch (err) {
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  const handleShowQRCode = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowQRCode(true);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réservations</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="validated">Validé</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {reservations.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(reservation.timestamp.toDate()).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(reservation.timestamp.toDate()).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reservation.status === 'validated' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.amount}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleShowQRCode(reservation)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Voir QR Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune réservation pour le moment</p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRCode && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code de réservation</h3>
              <button onClick={() => setShowQRCode(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <QRCode value={selectedReservation.qrCode} />
            </div>
            <p className="text-center text-gray-600 mb-4">
              Réservation pour {selectedReservation.userName}
            </p>
            <button
              onClick={() => setShowQRCode(false)}
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