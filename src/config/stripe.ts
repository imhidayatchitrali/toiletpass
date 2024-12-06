import { loadStripe } from '@stripe/stripe-js';

// Configuration Stripe
export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_51QJyZwRsucNItIWPHzrCljdjgcMapcKG1bOHALri2mc5l11ziVjMGtEZmnWupmkbZbXQNRd6A5Qnym40ThbnQfKm00U4ZWRWaz',
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '8px',
    },
  },
  locale: 'fr'
};

// Instance Stripe
export const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);