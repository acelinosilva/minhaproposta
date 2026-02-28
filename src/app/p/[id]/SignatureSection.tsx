'use client';

import { useState } from 'react';

interface SignatureSectionProps {
    proposalId: string;
    initialStatus: string;
    signatureName?: string;
    signatureDate?: string;
    signatureIp?: string;
    accentColor: string;
    enableBilling?: boolean;
    billingAmount?: number;
}

export default function SignatureSection({
    proposalId,
    initialStatus,
    signatureName,
    signatureDate,
    signatureIp,
    accentColor,
    enableBilling,
    billingAmount
}: SignatureSectionProps) {
    const [status, setStatus] = useState(initialStatus);
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState('');

    const handleSign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch(`/api/proposals/${proposalId}/sign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: name })
            });

            if (res.ok) {
                setStatus('accepted');
            } else {
                const data = await res.json();
                setError(data.error || 'Erro ao assinar proposta');
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'accepted') {
        return (
            <div style={{ marginTop: '4rem', padding: '2rem', border: `2px solid ${accentColor}`, borderRadius: '8px', background: `${accentColor}10`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: accentColor }}>Proposta Aceita e Assinada</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Documento validado digitalmente por <strong>{signatureName || name}</strong> em {new Date(signatureDate || new Date()).toLocaleDateString('pt-BR')}.
                </p>

                {enableBilling && billingAmount && billingAmount > 0 && !paid && (
                    <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '1rem' }}>
                        <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Investimento: R$ {billingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <button
                            onClick={() => {
                                alert('Simulando Stripe: Redirecionando para check-out...');
                                setTimeout(() => setPaid(true), 2000);
                            }}
                            className="btn-primary"
                            style={{ background: '#635bff', color: 'white', width: '100%', maxWidth: '300px' }}
                        >
                            💳 Pagar via Stripe
                        </button>
                    </div>
                )}

                {paid && (
                    <div style={{ marginTop: '1rem', color: '#22c55e', fontWeight: 'bold' }}>
                        💰 Pagamento Confirmado! Obrigado pela confiança.
                    </div>
                )}

                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: '1.5rem' }}>
                    Registro IP: {signatureIp || 'Verificando...'} | ID: {proposalId}
                </div>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '4rem', borderTop: '2px dashed var(--border)', paddingTop: '3rem' }}>
            <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pronto para começarmos?</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
                    Ao clicar em aceitar, você concorda com os termos e o escopo descritos nesta proposta comercial.
                </p>

                {error && <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Seu Nome Completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            fontSize: '1rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !name}
                        style={{
                            padding: '14px',
                            borderRadius: '6px',
                            background: accentColor,
                            color: '#000',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: (isSubmitting || !name) ? 0.6 : 1,
                            transition: 'transform 0.2s'
                        }}
                    >
                        {isSubmitting ? 'Assinando...' : '✓ Aceitar e Assinar Proposta'}
                    </button>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                        * Esta é uma assinatura digital com validade de aceite comercial.
                    </p>
                </form>
            </div>
        </div>
    );
}
