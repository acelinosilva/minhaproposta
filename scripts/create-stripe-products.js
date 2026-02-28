const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
const fs = require('fs');

async function createProducts() {
    try {
        console.log('Creating Profissional plan...');
        const proProduct = await stripe.products.create({
            name: 'PropostaAI - Profissional',
            description: 'Acesso completo ao motor IA e rastreamento em tempo real.',
        });

        const proPrice = await stripe.prices.create({
            product: proProduct.id,
            unit_amount: 9700, // R$ 97.00
            currency: 'brl',
            recurring: {
                interval: 'month',
            },
        });

        console.log('Profissional Price ID:', proPrice.id);

        console.log('Creating Agência plan...');
        const agencyProduct = await stripe.products.create({
            name: 'PropostaAI - Agência',
            description: 'Até 5 usuários, templates exclusivos e relatórios de equipe.',
        });

        const agencyPrice = await stripe.prices.create({
            product: agencyProduct.id,
            unit_amount: 19700, // R$ 197.00
            currency: 'brl',
            recurring: {
                interval: 'month',
            },
        });

        console.log('Agência Price ID:', agencyPrice.id);

        const envContent = `STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY || 'sk_live_...'}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_...'}
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PROFESSIONAL=${proPrice.id}
STRIPE_PRICE_AGENCY=${agencyPrice.id}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

        fs.writeFileSync('.env.local', envContent);
        console.log('.env.local has been created successfully!');

    } catch (error) {
        console.error("Error creating products:", error);
    }
}

createProducts();
