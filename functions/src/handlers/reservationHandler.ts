// import * as functions from "firebase-functions";
// import { sendAccessTicket  as sendAccessTicketEmail } from "../services/emailService";

// export const handleReservationConfirmation = async (
//   data: any,
//   context: functions.https.CallableContext
// ): Promise<{ success: boolean }> => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       "unauthenticated",
//       "Utilisateur non authentifié"
//     );
//   }

//   try {
//     await sendAccessTicketEmail({
//       userEmail: data.userEmail,
//       userName: data.userName,
//       reservationId: data.reservationId,
//       confirmationCode: data.confirmationCode,
//       establishmentName: data.establishmentName,
//       establishmentAddress: data.establishmentAddress,
//       amount: data.amount,
//       timestamp: data.timestamp,
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error handling reservation confirmation:", error);
//     throw new functions.https.HttpsError(
//       "internal",
//       "Erreur lors de l'envoi de l'email"
//     );
//   }
// };

import * as functions from "firebase-functions";
import { sendAccessTicket as sendAccessTicketEmail } from "../services/emailService";

export const handleReservationConfirmation = async (
  data: any,
  context: functions.https.CallableRequest // Update here
): Promise<{ success: boolean }> => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Utilisateur non authentifié"
    );
  }

  try {
    await sendAccessTicketEmail({
      userEmail: data.userEmail,
      userName: data.userName,
      reservationId: data.reservationId,
      confirmationCode: data.confirmationCode,
      establishmentName: data.establishmentName,
      establishmentAddress: data.establishmentAddress,
      amount: data.amount,
      timestamp: data.timestamp,
    });

    return { success: true };
  } catch (error) {
    console.error("Error handling reservation confirmation:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Erreur lors de l'envoi de l'email"
    );
  }
};
