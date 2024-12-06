import  { useState, useEffect } from 'react';
import { Euro, Users, CalendarCheck, TrendingUp, Plus, AlertCircle } from 'lucide-react';
import {  doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import { AddEstablishmentModal } from './AddEstablishmentModal';
import { EstablishmentsList } from './EstablishmentsList';

export const AdminDashboard = () => {
  const { user } = useAuthContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    dailyRevenue: 0,
    dailyReservations: 0,
    uniqueClients: 0,
    occupancyRate: 0,
    totalBalance: 0,
    lastWithdrawal: 0
  });

  useEffect(() => {
    if (user) {
      initializeStats();
    }
  }, [user]);

  const initializeStats = async () => {
    if (!user) return;

    try {
      // Vérifier si les stats existent déjà
      const statsRef = doc(db, 'stats', user.uid);
      const statsDoc = await getDoc(statsRef);

      if (!statsDoc.exists()) {
        // Créer les stats initiales
        await setDoc(statsRef, {
          dailyRevenue: 0,
          dailyReservations: 0,
          uniqueClients: 0,
          occupancyRate: 0,
          totalBalance: 0,
          lastWithdrawal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        setStats({
          dailyRevenue: 0,
          dailyReservations: 0,
          uniqueClients: 0,
          occupancyRate: 0,
          totalBalance: 0,
          lastWithdrawal: 0
        });
      } else {
        // Utiliser les stats existantes
        const statsData = statsDoc.data();
        setStats({
          dailyRevenue: statsData.dailyRevenue || 0,
          dailyReservations: statsData.dailyReservations || 0,
          uniqueClients: statsData.uniqueClients || 0,
          occupancyRate: statsData.occupancyRate || 0,
          totalBalance: statsData.totalBalance || 0,
          lastWithdrawal: statsData.lastWithdrawal || 0
        });
      }
    } catch (err) {
      console.error('Error initializing stats:', err);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un établissement
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus du jour</p>
              <p className="text-2xl font-bold">{stats.dailyRevenue}€</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Réservations du jour</p>
              <p className="text-2xl font-bold">{stats.dailyReservations}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CalendarCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clients uniques</p>
              <p className="text-2xl font-bold">{stats.uniqueClients}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux d'occupation</p>
              <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des établissements */}
      <EstablishmentsList />

      {/* Modal d'ajout d'établissement */}
      <AddEstablishmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={() => {
          setShowAddModal(false);
          initializeStats(); // Rafraîchir les stats après l'ajout
        }}
      />
    </div>
  );
};