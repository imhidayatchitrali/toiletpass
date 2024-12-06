import * as functions from "firebase-functions";
import Stripe from "stripe";

const stripe = new Stripe(functions.config().stripe.secret_key, {
  // apiVersion: "2023-10-16",
  apiVersion: "2024-11-20.acacia"
});

interface PaymentData {
  amount: number;
  userId: string;
}

export const createPaymentIntent = functions.https.onCall(async (request: functions.https.CallableRequest<PaymentData>, context) => {
  const { amount, userId } = request.data;

  // Validate the amount
  if (amount < 5 || amount > 100) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Le montant doit être entre 5€ et 100€"
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "eur",
      metadata: {
        userId: userId, // Use the userId from the data object
        type: "wallet_topup"
      }
    });

    return {
      clientSecret: paymentIntent.client_secret
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Erreur lors de la création du paiement"
    );
  }
});