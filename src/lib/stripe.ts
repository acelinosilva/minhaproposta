import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing. Stripe features will fail at runtime.');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
    appInfo: {
        name: 'PropostaAI',
        version: '1.0.0',
    },
});
