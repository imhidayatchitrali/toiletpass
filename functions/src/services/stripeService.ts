import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { db } from '../lib/firebase';
import { generateTimeSlot } from '../utils/timeUtils';

const stripe = new Stripe(functions.config().stripe.secret_key, {
  // apiVersion: '2023-10-16'
  apiVersion: "2024-11-20.acacia"
  

});

export const createPaymentIntent = async (data: {
  amount: number;
  userId: string;
  toiletId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  userEmail?: string;
  userName?: string;
}) => {
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
    console.error('Error creating payment intent:', error);
    throw new functions.https.HttpsError('internal', 'Error creating payment');
  }
};

export const handleWebhookEvent = async (event: Stripe.Event) => {
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata;

    // Générer un code de confirmation unique
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Générer le créneau horaire (1h à partir de maintenant)
    const { startTime, endTime } = generateTimeSlot();

    // Créer la réservation
    const reservationRef = db.collection('reservations').doc();
    await reservationRef.set({
      toiletId: metadata.toiletId,
      userId: metadata.userId,
      userEmail: metadata.userEmail,
      userName: metadata.userName || 'Utilisateur',
      amount: paymentIntent.amount / 100,
      status: 'validated',
      timestamp: new Date(),
      confirmationCode,
      establishmentId: metadata.establishmentId,
      establishmentName: metadata.establishmentName,
      establishmentAddress: metadata.establishmentAddress,
      paymentMethod: 'card',
      qrCode: `${metadata.toiletId}-${confirmationCode}`,
      timeSlot: {
        start: startTime,
        end: endTime
      }
    });

    // Envoyer l'email de confirmation
    await db.collection('mail').add({
      to: metadata.userEmail,
      template: {
        name: 'reservation-confirmation',
        data: {
          userName: metadata.userName || 'Utilisateur',
          confirmationCode,
          establishmentName: metadata.establishmentName,
          establishmentAddress: metadata.establishmentAddress,
          amount: paymentIntent.amount / 100,
          timestamp: new Date().toISOString(),
          timeSlot: {
            start: startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            end: endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          }
        }
      }
    });

    return { success: true, reservationId: reservationRef.id };
  }

  return { success: true };
};