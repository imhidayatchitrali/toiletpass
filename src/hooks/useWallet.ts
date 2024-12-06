import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useWallet = (userId: string | null) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      initializeWallet();
    }
  }, [userId]);

  const initializeWallet = async () => {
    try {
      const walletRef = doc(db, 'wallets', userId!);
      const walletDoc = await getDoc(walletRef);

      if (!walletDoc.exists()) {
        // Créer le wallet s'il n'existe pas
        await setDoc(walletRef, {
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId
        });
        setBalance(0);
      } else {
        setBalance(walletDoc.data().balance || 0);
      }
    } catch (err) {
      console.error('Error initializing wallet:', err);
      setError('Impossible d\'initialiser le portefeuille');
    } finally {
      setLoading(false);
    }
  };

  const addFunds = async (amount: number) => {
    if (!userId) return false;
    setError(null);

    try {
      if (amount < 5 || amount > 100) {
        throw new Error('Montant invalide (min: 5€, max: 100€)');
      }

      const walletRef = doc(db, 'wallets', userId);
      const newBalance = balance + amount;

      await updateDoc(walletRef, {
        balance: newBalance,
        updatedAt: new Date()
      });

      // Créer la transaction
      await addDoc(collection(db, 'transactions'), {
        userId,
        type: 'topup',
        amount,
        timestamp: new Date(),
        status: 'completed',
        balance: newBalance
      });

      setBalance(newBalance);
      return true;
    } catch (err) {
      console.error('Error adding funds:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du rechargement');
      return false;
    }
  };

  const deductFunds = async (amount: number) => {
    if (!userId) return false;
    setError(null);

    try {
      if (amount > balance) {
        throw new Error('Solde insuffisant');
      }

      const walletRef = doc(db, 'wallets', userId);
      const newBalance = balance - amount;

      await updateDoc(walletRef, {
        balance: newBalance,
        updatedAt: new Date()
      });

      // Créer la transaction
      await addDoc(collection(db, 'transactions'), {
        userId,
        type: 'payment',
        amount,
        timestamp: new Date(),
        status: 'completed',
        balance: newBalance
      });

      setBalance(newBalance);
      return true;
    } catch (err) {
      console.error('Error deducting funds:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement');
      return false;
    }
  };

  return {
    balance,
    loading,
    error,
    addFunds,
    deductFunds
  };
};