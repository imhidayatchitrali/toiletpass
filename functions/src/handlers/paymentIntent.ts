// import * as functions from 'firebase-functions';
// import { stripe } from '../config/stripe';

// export const createPaymentIntent = async (
//   data: { 
//     amount: number;
//     toiletId: string;
//     establishmentId: string;
//     establishmentName: string;
//     establishmentAddress: string;
//   },
//   context: functions.https.CallableContext
// ): Promise<{ clientSecret: string }> => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       'unauthenticated',
//       'User must be authenticated'
//     );
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(data.amount * 100),
//       currency: 'eur',
//       metadata: {
//         userId: context.auth.uid,
//         toiletId: data.toiletId,
//         establishmentId: data.establishmentId,
//         establishmentName: data.establishmentName,
//         establishmentAddress: data.establishmentAddress,
//         userEmail: context.auth.token.email || '',
//         userName: context.auth.token.name || ''
//       },
//     });

//     return { clientSecret: paymentIntent.client_secret };
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     throw new functions.https.HttpsError('internal', 'Error creating payment');
//   }
// };


import * as functions from 'firebase-functions';
import { stripe } from '../config/stripe';

export const createPaymentIntent = async (
  data: { 
    amount: number;
    toiletId: string;
    establishmentId: string;
    establishmentName: string;
    establishmentAddress: string;
  },
  context: functions.https.CallableRequest
): Promise<{ clientSecret: string }> => {
  // Check if the user is authenticated using context.auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        userId: context.auth.uid, // Get user ID from context
        toiletId: data.toiletId,
        establishmentId: data.establishmentId,
        establishmentName: data.establishmentName,
        establishmentAddress: data.establishmentAddress,
        userEmail: context.auth.token?.email || '', // Optional chaining for token
        userName: context.auth.token?.name || '' // Optional chaining for token
      },
    });

    // Ensure clientSecret is never null
    return { clientSecret: paymentIntent.client_secret ?? '' };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new functions.https.HttpsError('internal', 'Error creating payment');
  }
};
