// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import { stripe } from '../config/stripe';

// export const handleStripeWebhook = async (req: functions.https.Request, res: functions.Response): Promise<void> => {
//   const sig = req.headers['stripe-signature'];
//   const webhookSecret = functions.config().stripe.webhook_secret;

//   if (!sig) {
//     res.status(400).send('No signature provided');
//     return;
//   }

//   try {
//     const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    
//     if (event.type === 'payment_intent.succeeded') {
//       const paymentIntent = event.data.object;
//       const metadata = paymentIntent.metadata;

//       // Créer la réservation
//       const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
//       const reservationRef = admin.firestore().collection('reservations').doc();
      
//       await reservationRef.set({
//         toiletId: metadata.toiletId,
//         userId: metadata.userId,
//         userEmail: metadata.userEmail,
//         userName: metadata.userName || 'Utilisateur',
//         amount: paymentIntent.amount / 100,
//         status: 'validated',
//         timestamp: admin.firestore.FieldValue.serverTimestamp(),
//         confirmationCode,
//         establishmentId: metadata.establishmentId,
//         establishmentName: metadata.establishmentName,
//         establishmentAddress: metadata.establishmentAddress,
//         paymentMethod: 'card',
//         qrCode: `${metadata.toiletId}-${confirmationCode}`
//       });

//       // Envoyer l'email de confirmation
//       const sendAccessTicket = functions.config().email.enabled ? 
//         admin.firestore().collection('mail').add({
//           to: metadata.userEmail,
//           template: {
//             name: 'access-ticket',
//             data: {
//               userName: metadata.userName || 'Utilisateur',
//               confirmationCode,
//               establishmentName: metadata.establishmentName,
//               establishmentAddress: metadata.establishmentAddress,
//               amount: paymentIntent.amount / 100,
//               reservationId: reservationRef.id
//             }
//           }
//         }) : Promise.resolve();

//       await sendAccessTicket;
//     }

//     res.json({ received: true });
//   } catch (err) {
//     console.error('Webhook error:', err);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// };

import * as functions from 'firebase-functions'; // Only import if needed
import * as admin from 'firebase-admin'; // Import if needed
import { stripe } from '../config/stripe';

export const handleStripeWebhook = async (req: functions.https.Request, res: any): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe.webhook_secret;

  if (!sig) {
    res.status(400).send('No signature provided');
    return;
  }

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;

      // Créer la réservation
      const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const reservationRef = admin.firestore().collection('reservations').doc();
      
      await reservationRef.set({
        toiletId: metadata.toiletId,
        userId: metadata.userId,
        userEmail: metadata.userEmail,
        userName: metadata.userName || 'Utilisateur',
        amount: paymentIntent.amount / 100,
        status: 'validated',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        confirmationCode,
        establishmentId: metadata.establishmentId,
        establishmentName: metadata.establishmentName,
        establishmentAddress: metadata.establishmentAddress,
        paymentMethod: 'card',
        qrCode: `${metadata.toiletId}-${confirmationCode}`
      });

      // Envoyer l'email de confirmation
      const sendAccessTicket = functions.config().email.enabled ? 
        admin.firestore().collection('mail').add({
          to: metadata.userEmail,
          template: {
            name: 'access-ticket',
            data: {
              userName: metadata.userName || 'Utilisateur',
              confirmationCode,
              establishmentName: metadata.establishmentName,
              establishmentAddress: metadata.establishmentAddress,
              amount: paymentIntent.amount / 100,
              reservationId: reservationRef.id
            }
          }
        }) : Promise.resolve();

      await sendAccessTicket;
    }

    res.json({ received: true });
  } catch (err: any) { // Change type annotation if needed
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};