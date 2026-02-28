import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { priceId } = await req.json();

        if (!priceId) {
            return NextResponse.json(
                { error: "Price ID is required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Determine the base URL for success/cancel redirects
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "required",
            customer_email: user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            allow_promotion_codes: true,
            subscription_data: {
                metadata: {
                    userId: user.id,
                },
            },
            client_reference_id: user.id,
            success_url: `${siteUrl}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/dashboard?upgrade=cancel`,
        });

        if (!session.url) {
            return NextResponse.json(
                { error: "Failed to create Stripe session URL" },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong with checkout" },
            { status: 500 }
        );
    }
}
