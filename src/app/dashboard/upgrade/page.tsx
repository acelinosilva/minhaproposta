'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function UpgradeStatus() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const upgrade = searchParams.get('upgrade');

    useEffect(() => {
        if (upgrade === 'success') {
            const timer = setTimeout(() => router.push('/dashboard'), 5000);
            return () => clearTimeout(timer);
        }
    }, [upgrade, router]);

    if (upgrade === 'success') {
        return (
            <div className="glass-card" style={{ maxWidth: '500px', margin: '100px auto', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '1rem' }}>Pagamento Aprovado!</h1>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>
                    Sua assinatura foi ativada com sucesso. Muito obrigado por escolher o PropostaAI!
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                    Redirecionando para o dashboard em alguns segundos...
                </p>
            </div>
        );
    }

    if (upgrade === 'cancel') {
        return (
            <div className="glass-card" style={{ maxWidth: '500px', margin: '100px auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Pagamento Cancelado</h1>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>
                    O processo de assinatura foi interrompido. Nenhuma cobrança foi realizada.
                </p>
                <button className="btn-primary" onClick={() => router.push('/dashboard')}>
                    Voltar para o Dashboard
                </button>
            </div>
        );
    }

    return null;
}

export default function UpgradePage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <UpgradeStatus />
        </Suspense>
    );
}
