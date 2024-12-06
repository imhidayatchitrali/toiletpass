import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createPaymentIntent } from './services/payment.service';
const cors = require('cors')({ origin: ['http://localhost:5173'] });

admin.initializeApp();

interface PaymentData {
  amount: number;
  toiletId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  userId: string;
  userEmail: string;
  userName: string;
}

// Change to onRequest to allow CORS with HTTP requests (if using onRequest)
export const createPayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Check for POST request
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    // Access user information from the request body
    const data: PaymentData = req.body.data;
    const { userId, userEmail, userName } = data;

    // Validate data and ensure all required fields are present, including user information
    if (!data.amount || !data.toiletId || !data.establishmentId || !data.establishmentName || !data.establishmentAddress || !userId || !userEmail || !userName) {
      return res.status(400).send('Incomplete paymsdsent data');
    }

    try {
      const paymentIntent = await createPaymentIntent({
        ...data, // Spread operator to include all payment data
      });

      // Send back the payment intent object or any relevant info
      return res.status(200).json(paymentIntent);
    } catch (error) {
      console.error('Payment intent creation error:', error);
      return res.status(500).send('Error creating payment');
    }
  });
});
