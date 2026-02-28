'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

export default function SupportPage() {
    const [isAgency, setIsAgency] = useState<boolean | null>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const supabase = createClient();

    // In a real Server Component we'd check this on the server, but for simplicity we'll do it client-side here
    // or we can just fetch it on mount
    useState(() => {
        async function checkPlan() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('plan')
                    .eq('id', user.id)
                    .single();
                setIsAgency(userData?.plan === 'agency');
            }
        }
        checkPlan();
    });

    if (isAgency === null) return null; // loading

    if (!isAgency) {
        return (
            <FeaturePlaceholder
                title="Gerente de Conta VIP"
                description="Chat direto e agendamento de chamadas com seu especialista de Sucesso do Cliente."
                icon="📞"
                requiredPlan="agency"
                userPlan="pro" // fake it since we just want the upsell
            />
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulating API call
        setTimeout(() => {
            setStatus('success');
            // reset after 3s
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📞</span> Gerente VIP
                    </h1>
                    <p className="text-muted">Apoio estratégico 1-a-1 focado no crescimento da sua Agência.</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <section className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: 'fit-content' }}>
                    <div style={{ background: 'var(--c-primary-dim)', height: '100px', width: '100%' }}></div>
                    <div style={{ padding: '2rem', paddingTop: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: '#ccc',
                            marginTop: '-50px',
                            border: '4px solid var(--c-background)',
                            backgroundImage: 'url("https://i.pravatar.cc/300?img=68")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            marginBottom: '1rem'
                        }}></div>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Lucas Farias</h2>
                        <span style={{ color: 'var(--c-primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>Especialista Customer Success</span>

                        <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '2rem' }}>
                            Oi! Estou aqui para ajudar sua agência a extrair o máximo do Proposta Fácil. Como posso ajudar nas suas conversões hoje?
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                            <button className="btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
                                📅 Agendar Call
                            </button>
                            <button className="btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
                                📱 Ver WhatsApp
                            </button>
                        </div>
                    </div>
                </section>

                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✉️</span> Mensagem Direta
                    </h3>

                    {status === 'success' ? (
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--c-green)', borderRadius: '8px', border: '1px solid var(--c-green)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Mensagem Enviada!</h4>
                            <p>O Lucas vai te responder em até 2 horas úteis.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="label">Qual o assunto central?</label>
                                <select className="input-field" required style={{ background: 'var(--c-background-soft)' }}>
                                    <option value="">Selecione um tópico...</option>
                                    <option value="revisao">Revisão de Proposta Estratégica</option>
                                    <option value="onboarding">Treinamento para a Equipe</option>
                                    <option value="bug">Suporte Técnico Prioritário</option>
                                    <option value="outro">Outro assunto</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">Mensagem</label>
                                <textarea
                                    className="input-field"
                                    rows={5}
                                    required
                                    placeholder="Digite os detalhes da sua requisição..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Enviando...' : 'Enviar para o Gerente'}
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </div>
    );
}
