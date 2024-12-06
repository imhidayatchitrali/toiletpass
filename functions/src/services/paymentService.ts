import { stripe } from '../config/stripe';
import * as functions from 'firebase-functions';

interface PaymentData {
  amount: number;
  toiletId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  userId: string;
  userEmail?: string;
  userName?: string;
}

export const createPaymentIntent = async (data: PaymentData) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: 'eur',
      metadata: {
        userId: data.userId,
        toiletId: data.toiletId,
        establishmentId: data.establishmentId,
        establishmentName: data.establishmentName,
        establishmentAddress: data.establishmentAddress,
        userEmail: data.userEmail || '',
        userName: data.userName || ''
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    return paymentIntent;
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw new functions.https.HttpsError('internal', 'Error creating payment');
  }
};