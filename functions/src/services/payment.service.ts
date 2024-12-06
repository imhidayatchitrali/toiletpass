import { stripe } from '../config/stripe';
import * as functions from 'firebase-functions';

interface PaymentIntentData {
  amount: number;
  toiletId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  userId: string;
  userEmail?: string;
  userName?: string;
}

interface PaymentIntentResult {
  clientSecret: string;
}

export const createPaymentIntent = async (data: PaymentIntentData): Promise<PaymentIntentResult> => {
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
        enabled: true,
        allow_redirects: 'never'
      },
      // payment_method_types: ['card'],
      capture_method: 'automatic'
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Client secret missing from payment intent');
    }

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw new functions.https.HttpsError('internal', 'Error creating payment');
  }
};