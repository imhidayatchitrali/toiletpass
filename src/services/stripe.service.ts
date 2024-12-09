import { functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";

interface PaymentIntentData {
  amount: number;
  toiletId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  userEmail?: string;
  userName?: string;
}

interface PaymentIntentResult {
  clientSecret: string;
}

export class StripeService {
  static async createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResult> {
    console.log({data})
    try {
      const createPayment = httpsCallable<PaymentIntentData, PaymentIntentResult>(functions, "createPayment");
      const result = await createPayment(data);
      console.log({ result });

      if (!result.data || !result.data.clientSecret) {
        throw new Error("Réponse invalide du serveur");
      }

      return result.data;
    } catch (error) {
      console.error("Erreur création payment intent:", error);
      throw error;
    }
  }
}
