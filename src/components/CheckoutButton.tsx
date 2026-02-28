'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
    priceId: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export default function CheckoutButton({ priceId, className, style, children }: CheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await res.json();

            if (data.error === "Unauthorized") {
                // Redirect to login but save the intent if we want to (for now just login)
                router.push('/login');
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Ocorreu um erro ao processar o pagamento. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className={className}
            style={{ width: '100%', justifyContent: 'center', ...style }}
        >
            {isLoading ? 'Processando...' : children}
        </button>
    );
}
