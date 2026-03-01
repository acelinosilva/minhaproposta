'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Eye, Clock, MessageCircle, Mail } from 'lucide-react';

interface ShareProposalPanelProps {
    proposalId: string;
    viewCount: number;
    lastViewedAt: string | null;
    timeSpent?: number;
    feedbackCount?: number;
    clientName?: string;
    serviceType?: string;
}

export default function ShareProposalPanel({
    proposalId,
    viewCount,
    lastViewedAt,
    timeSpent = 0,
    feedbackCount = 0,
    clientName = 'Cliente',
    serviceType = 'Serviços'
}: ShareProposalPanelProps) {
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [followUps, setFollowUps] = useState<{ type: string, text: string }[]>([]);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${proposalId}` : '';

    const handleGenerateFollowUp = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/ai/follow-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposalId })
            });
            const data = await res.json();
            if (data.followUps) setFollowUps(data.followUps);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const waMessage = encodeURIComponent(`Olá ${clientName}, tudo bem? Segue aqui a proposta para ${serviceType} que conversamos: ${shareUrl}\n\nFico à disposição para qualquer dúvida!`);
    const waUrl = `https://wa.me/?text=${waMessage}`;

    const emailSubject = encodeURIComponent(`Proposta Comercial - ${serviceType}`);
    const emailBody = encodeURIComponent(`Olá ${clientName},\n\nEspero que esteja bem.\n\nConforme conversamos, segue o link da nossa proposta detalhada para ${serviceType}:\n\n${shareUrl}\n\nQualquer dúvida, estou à disposição.\n\nAtenciosamente,`);
    const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

    return (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '350px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Compartilhar Proposta</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>Envie este link para o seu cliente acessar a proposta online.</p>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="input-field"
                        style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
                        onClick={(e) => e.currentTarget.select()}
                    />
                    <button onClick={handleCopy} className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                        {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e', color: '#22c55e' }}
                    >
                        <MessageCircle size={16} /> Enviar via WhatsApp
                    </a>
                    <a
                        href={emailUrl}
                        className="btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Mail size={16} /> Enviar via E-mail
                    </a>
                    <a
                        href={`/p/${proposalId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem' }}
                        title="Abrir link"
                    >
                        <ExternalLink size={16} /> Ver Pública
                    </a>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Eye size={14} /> Visualizações
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{viewCount || 0}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} /> Tempo total lido
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {timeSpent > 0 ? `${Math.round(timeSpent / 60)} min` : '< 1 min'}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MessageCircle size={14} /> Comentários
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {feedbackCount || 0}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ExternalLink size={14} /> Último acesso
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {lastViewedAt ? new Date(lastViewedAt).toLocaleDateString('pt-BR') : 'Nunca'}
                    </span>
                </div>
            </div>

            <div style={{ width: '100%', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            ✨ Sugestões de Follow-up (IA)
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>Baseado no comportamento do cliente na proposta.</p>
                    </div>
                    <button
                        onClick={handleGenerateFollowUp}
                        disabled={generating}
                        className="btn-primary btn-sm"
                        style={{ height: '32px', fontSize: '0.8rem' }}
                    >
                        {generating ? 'Analisando...' : 'Gerar Novas Sugestões'}
                    </button>
                </div>

                {followUps.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {followUps.map((f, idx) => (
                            <div key={idx} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: f.type === 'WhatsApp' ? '#22c55e' : 'var(--muted)' }}>
                                        {f.type}
                                    </span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(f.text);
                                            alert('Copiado para o clipboard!');
                                        }}
                                        style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                                        title="Copiar texto"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.4, color: 'var(--text-primary)' }}>{f.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
