import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

// No top-level warns or throws to prevent Vercel build-time module evaluation failures.
// The actual API routes that use this 'stripe' instance will handle missing keys at runtime if necessary.

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
    appInfo: {
        name: 'PropostaAI',
        version: '1.0.0',
    },
});
