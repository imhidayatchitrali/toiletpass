import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, History, Home, Plus, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const UserWallet = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [customAmount, setCustomAmount] = useState('');
  const [topUpError, setTopUpError] = useState('');

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const walletRef = doc(db, 'wallets', user!.uid);
      const walletDoc = await getDoc(walletRef);
      
      if (walletDoc.exists()) {
        setBalance(walletDoc.data().balance || 0);
      } else {
        await updateDoc(walletRef, {
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
      setError('Impossible de charger votre cagnotte');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user!.uid),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTransactions(transactionsData);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleTopUp = async (amount: number) => {
    if (!user) return;
    setTopUpError('');

    if (amount < 5) {
      setTopUpError('Le montant minimum est de 5€');
      return;
    }

    if (amount > 100) {
      setTopUpError('Le montant maximum est de 100€');
      return;
    }

    try {
      const walletRef = doc(db, 'wallets', user.uid);
      await updateDoc(walletRef, {
        balance: balance + amount,
        updatedAt: new Date()
      });

      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'topup',
        amount,
        timestamp: new Date(),
        status: 'completed'
      });

      setBalance(prev => prev + amount);
      setShowTopUpModal(false);
      setCustomAmount('');
      fetchTransactions();
    } catch (err) {
      console.error('Error topping up wallet:', err);
      setTopUpError('Impossible de recharger votre cagnotte');
    }
  };

  const handleCustomAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customAmount);
    if (isNaN(amount)) {
      setTopUpError('Veuillez entrer un montant valide');
      return;
    }
    handleTopUp(amount);
  };

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
            <h1 className="text-2xl font-bold">Ma Cagnotte</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Solde disponible</h2>
                    <p className="text-3xl font-bold text-blue-600">{balance.toFixed(2)}€</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Recharger
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Historique des transactions
                </h3>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {transaction.type === 'topup' ? 'Rechargement' : 'Paiement'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.timestamp.toDate()).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <span className={`font-semibold ${
                          transaction.type === 'topup' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'topup' ? '+' : '-'}{transaction.amount}€
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Aucune transaction pour le moment
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de rechargement */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
              Recharger ma cagnotte
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[5, 10, 20].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleTopUp(amount)}
                  className="p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <p className="text-lg font-bold text-blue-600">{amount}€</p>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <div className="relative">
                <form onSubmit={handleCustomAmountSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ou entrez un montant personnalisé
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="5"
                        max="100"
                        step="0.01"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg pr-8"
                        placeholder="Montant..."
                      />
                      <span className="absolute right-3 top-2 text-gray-500">€</span>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Valider
                    </button>
                  </div>
                </form>
              </div>
              {topUpError && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {topUpError}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Montant minimum : 5€ - Maximum : 100€
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowTopUpModal(false);
                  setCustomAmount('');
                  setTopUpError('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};