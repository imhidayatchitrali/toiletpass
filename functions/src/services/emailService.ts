import * as nodemailer from "nodemailer";
import * as functions from "firebase-functions";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

interface EmailData {
  userEmail: string;
  userName: string;
  reservationId: string;
  confirmationCode: string;
  establishmentName: string;
  establishmentAddress: string;
  amount: number;
  timestamp: string;
}

export const sendAccessTicket = async (data: EmailData): Promise<void> => {
  const {
    userEmail,
    userName,
    reservationId,
    confirmationCode,
    establishmentName,
    establishmentAddress,
    amount,
    timestamp,
  } = data;

  const mailOptions = {
    from: '"ToiletPass" <noreply@toiletpass.com>',
    to: userEmail,
    subject: "Votre bon d'accès ToiletPass",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; color: white; text-align: center; padding: 20px;">
          <h1 style="margin: 0;">Bon d'accès ToiletPass</h1>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">
            Bonjour ${userName},
          </h2>
          <p style="color: #4b5563; line-height: 1.5;">
            Votre réservation a été confirmée. Voici votre bon d'accès :
          </p>
        </div>

        <div style="background-color: #fff; border: 2px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="background-color: #2563eb; color: white; padding: 10px; border-radius: 4px; font-size: 24px; font-family: monospace;">
              ${confirmationCode}
            </div>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <p style="margin: 5px 0;"><strong>Établissement :</strong> ${establishmentName}</p>
            <p style="margin: 5px 0;"><strong>Adresse :</strong> ${establishmentAddress}</p>
            <p style="margin: 5px 0;"><strong>Montant payé :</strong> ${amount}€</p>
            <p style="margin: 5px 0;"><strong>Date :</strong> ${new Date(timestamp).toLocaleString("fr-FR")}</p>
            <p style="margin: 5px 0;"><strong>N° de réservation :</strong> ${reservationId}</p>
          </div>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1f2937; margin-bottom: 10px;">Instructions :</h3>
          <ol style="color: #4b5563; margin: 0; padding-left: 20px;">
            <li>Présentez ce code à l'établissement</li>
            <li>Le code est à usage unique</li>
            <li>Valable uniquement pour cet établissement</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>
            Cet email a été envoyé automatiquement par ToiletPass.
            En cas de problème, contactez le support.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};