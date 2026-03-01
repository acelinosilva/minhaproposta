'use client';

import { useState } from 'react';

export default function FeedbackSection({ proposalId, accentColor }: { proposalId: string, accentColor: string }) {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/proposals/${proposalId}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            if (res.ok) {
                setSent(true);
                setMessage('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (sent) {
        return (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--c-green)', fontWeight: 'bold' }}>Sua mensagem foi enviada ao consultor. Obrigado!</p>
                <button onClick={() => setSent(false)} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline' }}>Enviar outra dúvida</button>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Dúvidas ou Comentários?</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>Use o campo abaixo para falar diretamente com quem preparou esta proposta.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                    placeholder="Escreva sua dúvida ou mensagem aqui..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '1rem',
                        borderRadius: '8px',
                        background: 'var(--c-black)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        resize: 'vertical',
                        fontSize: '0.9rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    style={{
                        alignSelf: 'flex-end',
                        padding: '0.75rem 2rem',
                        borderRadius: '6px',
                        background: accentColor,
                        color: '#000',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: (isSubmitting || !message.trim()) ? 0.6 : 1
                    }}
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
            </form>
        </div>
    );
}
