import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Disable body parsing, as Stripe requires the raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

// Use the service role key to bypass RLS when updating the DB from the webhook
// Fallback for build time to avoid module evaluation errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = (session as any).subscription_details?.metadata?.userId || session.metadata?.userId || (session as any).client_reference_id;
                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                if (!userId) {
                    console.error("No userId found in session metadata");
                    break;
                }

                // Fetch subscription to get the plan
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0].price.id;

                let plan = "basic";
                if (priceId === process.env.STRIPE_PRICE_PROFESSIONAL) {
                    plan = "professional";
                } else if (priceId === process.env.STRIPE_PRICE_AGENCY) {
                    plan = "agency";
                }

                // Upsert into Supabase
                const { error } = await supabaseAdmin
                    .from("subscriptions")
                    .upsert({
                        user_id: userId,
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                        status: subscription.status,
                        plan: plan,
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    }, { onConflict: 'user_id' });

                if (error) throw error;
                break;
            }

            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const priceId = subscription.items.data[0].price.id;
                let plan = "basic";
                if (priceId === process.env.STRIPE_PRICE_PROFESSIONAL) {
                    plan = "professional";
                } else if (priceId === process.env.STRIPE_PRICE_AGENCY) {
                    plan = "agency";
                }

                const { error } = await supabaseAdmin
                    .from("subscriptions")
                    .update({
                        status: subscription.status,
                        plan: plan,
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    })
                    .eq("stripe_subscription_id", subscription.id);

                if (error) throw error;
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error(`Error handling webhook event: ${error.message}`);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
