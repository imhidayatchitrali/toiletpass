import React, { useState } from 'react';
import { Euro, Users, CalendarCheck, TrendingUp, Plus, Building2 } from 'lucide-react';

export const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [lastWithdrawal, setLastWithdrawal] = useState(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cagnotte</h1>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          disabled={balance <= 0}
        >
          <Plus className="h-5 w-5 mr-2" />
          Retirer des fonds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Solde disponible</span>
          </div>
          <div className="text-3xl font-bold">{balance.toFixed(2)}€</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Revenus du mois</span>
          </div>
          <div className="text-3xl font-bold">{monthlyRevenue.toFixed(2)}€</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Euro className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Dernier retrait</span>
          </div>
          <div className="text-3xl font-bold">{lastWithdrawal.toFixed(2)}€</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Historique des transactions</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          Aucune transaction pour le moment
        </div>
      </div>
    </div>
  );
};