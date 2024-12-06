import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { httpsCallable, getFunctions } from 'firebase/functions';

const functions = getFunctions();

export const useEstablishmentVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerificationCode = async (phone: string) => {
    setLoading(true);
    setError(null);

    try {
      const sendCode = httpsCallable(functions, 'sendVerificationCode');
      await sendCode({ phone });
      return true;
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('Impossible d\'envoyer le code de vérification');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (phone: string, code: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const verifyPhoneCode = httpsCallable(functions, 'verifyPhoneCode');
      const result = await verifyPhoneCode({ phone, code });
      
      if (result.data.verified) {
        // Créer ou mettre à jour le document de vérification
        await setDoc(doc(db, 'verifiedEstablishments', userId), {
          phone,
          verifiedAt: new Date(),
          status: 'verified'
        });
        return true;
      }
      
      setError('Code invalide');
      return false;
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Erreur lors de la vérification');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async (userId: string) => {
    try {
      const verificationDoc = await getDoc(doc(db, 'verifiedEstablishments', userId));
      return verificationDoc.exists() && verificationDoc.data().status === 'verified';
    } catch (err) {
      console.error('Error checking verification status:', err);
      return false;
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    checkVerificationStatus,
    loading,
    error
  };
};