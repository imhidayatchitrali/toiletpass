const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.stripe.secret_key);
const cors = require("cors")({ origin: ["http://localhost:5173"] });

admin.initializeApp();

// Create Payment Function
exports.createPayment = functions.https.onRequest((req, res) => {
  
  cors(req, res, async () => {
    // Handle CORS with the cors middleware
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    // Ensure the user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).send("Unauthorized");
    }

    try {
      // Stripe payment intent creation
      const data = req.body;
      const paymentIntent = await stripe.paymentIntents.create({

        amount: Math.round(data.amount * 100), // Convert to cents
        currency: "eur",
        metadata: {
          userId: req.headers.authorization.split("Bearer ")[1], // Extract user ID from token
          toiletId: data.toiletId,
          establishmentId: data.establishmentId,
          establishmentName: data.establishmentName,
          establishmentAddress: data.establishmentAddress,
          userEmail: data.userEmail,
          userName: data.userName || "",
        },
      });

      res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

// Stripe Webhook Function
exports.stripeWebhook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Handle CORS with the cors middleware
    const sig = req.headers["stripe-signature"];
    const webhookSecret = functions.config().stripe.webhook_secret;

    if (!sig) {
      return res.status(400).send("No signature provided");
    }

    try {
      const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;

        const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const reservationRef = admin.firestore().collection("reservations").doc();

        await reservationRef.set({
          toiletId: metadata.toiletId,
          userId: metadata.userId,
          userEmail: metadata.userEmail,
          userName: metadata.userName || "Utilisateur",
          amount: paymentIntent.amount / 100,
          status: "validated",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          confirmationCode,
          establishmentId: metadata.establishmentId,
          establishmentName: metadata.establishmentName,
          establishmentAddress: metadata.establishmentAddress,
          paymentMethod: "card",
          qrCode: `${metadata.toiletId}-${confirmationCode}`,
        });
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // cors this.event()
});
