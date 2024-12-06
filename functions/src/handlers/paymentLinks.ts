// import * as functions from "firebase-functions";
// import Stripe from "stripe";

// const stripe = new Stripe(functions.config().stripe.secret_key, {
//   // apiVersion: "2023-10-16",
//   apiVersion: "2024-11-20.acacia"

// });

// export const createDynamicPaymentLink = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       "unauthenticated",
//       "Vous devez être connecté"
//     );
//   }

//   try {
//     const { minAmount = 500, maxAmount = 10000 } = data; // Montants en centimes (5€ - 100€)

//     const price = await stripe.prices.create({
//       currency: 'eur',
//       unit_amount_decimal: 'auto',
//       custom_unit_amount: {
//         enabled: true,
//         minimum: minAmount,
//         maximum: maxAmount,
//       },
//       product_data: {
//         name: 'Recharge ToiletPass',
//       },
//     });

//     const paymentLink = await stripe.paymentLinks.create({
//       line_items: [
//         {
//           price: price.id,
//           quantity: 1,
//         },
//       ],
//       after_completion: {
//         type: 'redirect',
//         redirect: {
//           url: `${process.env.FRONTEND_URL}/wallet?success=true`,
//         },
//       },
//       custom_fields: [
//         {
//           key: 'userId',
//           label: { type: 'custom', custom: 'User ID' },
//           type: 'text',
//         },
//       ],
//       custom_text: {
//         submit: { message: 'ToiletPass traitera votre paiement de manière sécurisée.' },
//       },
//       metadata: {
//         userId: context.auth.uid,
//       },
//     });

//     return { url: paymentLink.url };
//   } catch (error) {
//     console.error('Error creating payment link:', error);
//     throw new functions.https.HttpsError(
//       "internal",
//       "Erreur lors de la création du lien de paiement"
//     );
//   }
// });

import * as functions from "firebase-functions";
import Stripe from "stripe";

const stripe = new Stripe(functions.config().stripe.secret_key, {
  // apiVersion: "2023-10-16",
  apiVersion: "2024-11-20.acacia"
});

interface PaymentData {
  minAmount?: number; // Optional minimum amount in cents
  maxAmount?: number; // Optional maximum amount in cents
  userId: string; // Required user ID
}

export const createDynamicPaymentLink = functions.https.onCall(async (request: functions.https.CallableRequest<PaymentData>, context) => {
  const { minAmount = 500, maxAmount = 10000, userId } = request.data;

  try {
    const price = await stripe.prices.create({
      currency: 'eur',
      unit_amount_decimal: 'auto',
      custom_unit_amount: {
        enabled: true,
        minimum: minAmount,
        maximum: maxAmount,
      },
      product_data: {
        name: 'Recharge ToiletPass',
      },
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.FRONTEND_URL}/wallet?success=true&userId=${userId}`,
        },
      },
      custom_fields: [
        {
          key: 'userId',
          label: { type: 'custom', custom: 'User ID' },
          type: 'text',
        },
      ],
      custom_text: {
        submit: { message: 'ToiletPass traitera votre paiement de manière sécurisée.' },
      },
      metadata: {
        userId,
      },
    });

    return { url: paymentLink.url };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw new functions.https.HttpsError('internal', 'Erreur lors de la création du lien de paiement');
  }
});