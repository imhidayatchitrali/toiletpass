import * as admin from 'firebase-admin';
import { transporter } from '../config/email';

interface ReservationData {
  toiletId: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
}

export const createReservation = async (data: ReservationData) => {
  const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const reservationRef = admin.firestore().collection('reservations').doc();

  await reservationRef.set({
    toiletId: data.toiletId,
    userId: data.userId,
    userEmail: data.userEmail,
    userName: data.userName || 'Utilisateur',
    amount: data.amount,
    status: 'validated',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    confirmationCode,
    establishmentId: data.establishmentId,
    establishmentName: data.establishmentName,
    establishmentAddress: data.establishmentAddress,
    paymentMethod: 'card',
    qrCode: `${data.toiletId}-${confirmationCode}`
  });

  // Send confirmation email
  await transporter.sendMail({
    from: '"ToiletPass" <noreply@toiletpass.com>',
    to: data.userEmail,
    subject: "Votre réservation ToiletPass",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Confirmation de réservation</h1>
        <p>Bonjour ${data.userName},</p>
        <p>Votre réservation a été confirmée.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2>Code de confirmation: ${confirmationCode}</h2>
          <p>Établissement: ${data.establishmentName}</p>
          <p>Adresse: ${data.establishmentAddress}</p>
          <p>Montant: ${data.amount}€</p>
        </div>
        <p>Présentez ce code à l'établissement pour accéder aux services.</p>
      </div>
    `
  });

  return {
    reservationId: reservationRef.id,
    confirmationCode
  };
};