import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const usePublicToilets = (userId: string | null) => {
  const [canAdd, setCanAdd] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    const checkDailyCount = async () => {
      if (!userId) {
        setCanAdd(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const countRef = doc(db, 'publicToiletCounts', `${userId}_${today}`);
        const countDoc = await getDoc(countRef);

        if (!countDoc.exists()) {
          await setDoc(countRef, { count: 0, date: today });
          setDailyCount(0);
          setCanAdd(true);
        } else {
          const count = countDoc.data().count;
          setDailyCount(count);
          setCanAdd(count < 3);
        }
      } catch (error) {
        console.error('Error fetching daily count:', error);
        setCanAdd(false);
      }
    };

    checkDailyCount();
  }, [userId]);

  const incrementCount = async () => {
    if (!userId || !canAdd) return false;

    try {
      const today = new Date().toISOString().split('T')[0];
      const countRef = doc(db, 'publicToiletCounts', `${userId}_${today}`);
      const newCount = dailyCount + 1;

      if (newCount > 3) {
        return false;
      }

      await setDoc(countRef, {
        count: newCount,
        date: today
      });

      setDailyCount(newCount);
      setCanAdd(newCount < 3);
      return true;
    } catch (error) {
      console.error('Error incrementing count:', error);
      return false;
    }
  };

  return { canAdd, dailyCount, incrementCount };
};