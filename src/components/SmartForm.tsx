'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './form.css';

export default function SmartForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            clientName: formData.get('clientName'),
            serviceType: formData.get('serviceType'),
            scope: formData.get('scope'),
            timeframe: formData.get('timeframe'),
            tone: formData.get('tone'),
            targetAudience: formData.get('targetAudience'),
            keyBenefits: formData.get('keyBenefits'),
            projectPhases: formData.get('projectPhases'),
        };

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Erro ao gerar proposta');
            }

            // Redirecionar para o painel de visualização da proposta
            router.push('/dashboard/proposal/' + json.proposal.id);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="smart-form-container glass-card">
            <h2 className="text-gradient">Nova Proposta</h2>
            <p className="subtitle">Preencha os dados e deixe a IA criar a proposta ideal para você.</p>

            {error && (
                <div
                    className="error-alert"
                    style={{
                        background: error.includes('Limite') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        borderColor: error.includes('Limite') ? 'var(--c-primary)' : '#f43f5e',
                        color: error.includes('Limite') ? 'var(--c-primary)' : '#f43f5e',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <span style={{ fontWeight: 'bold' }}>{error}</span>
                    {error.includes('Limite') && (
                        <a href="/settings" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                            🚀 Ver Planos e Upgrade
                        </a>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="ai-form">
                <div className="form-row">
                    <div className="form-group flex-1">
                        <label className="label" htmlFor="clientName">Nome do Cliente / Empresa</label>
                        <input
                            className="input-field"
                            id="clientName"
                            name="clientName"
                            required
                            placeholder="Ex: Tech Solutions Ltda"
                        />
                    </div>

                    <div className="form-group flex-1">
                        <label className="label" htmlFor="serviceType">Tipo de Serviço</label>
                        <input
                            className="input-field"
                            id="serviceType"
                            name="serviceType"
                            required
                            placeholder="Ex: Criação de Landing Page, Gestão de Redes..."
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="targetAudience">Público-Alvo / Perfil do Cliente</label>
                    <input
                        className="input-field"
                        id="targetAudience"
                        name="targetAudience"
                        placeholder="Ex: Startups de tecnologia, Médicos autônomos, Imobiliárias..."
                    />
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="scope">Escopo do Projeto (Detalhes importantes)</label>
                    <textarea
                        className="input-field textarea-field"
                        id="scope"
                        name="scope"
                        rows={4}
                        required
                        placeholder="Ex: Design no Figma, Desenvolvimento Next.js, SEO on-page inclído. Cliente quer foco em conversão mobile..."
                    />
                </div>

                <div className="form-row">
                    <div className="form-group flex-1">
                        <label className="label" htmlFor="keyBenefits">Principais Diferenciais (Separe por vírgula)</label>
                        <input
                            className="input-field"
                            id="keyBenefits"
                            name="keyBenefits"
                            placeholder="Ex: Suporte 24/7, Design Exclusivo, Entrega Rápida"
                        />
                    </div>

                    <div className="form-group flex-1">
                        <label className="label" htmlFor="tone">Tom de Comunicação</label>
                        <select className="input-field" id="tone" name="tone">
                            <option value="persuasive">Persuasivo & Comercial (Padrão)</option>
                            <option value="formal">Formal & Corporativo</option>
                            <option value="technical">Técnico & Detalhista</option>
                            <option value="friendly">Amigável & Próximo</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group flex-1">
                        <label className="label" htmlFor="timeframe">Prazo Estimado</label>
                        <input
                            className="input-field"
                            id="timeframe"
                            name="timeframe"
                            placeholder="Ex: 15 dias úteis"
                        />
                    </div>

                    <div className="form-group flex-1">
                        <label className="label" htmlFor="projectPhases">Fases / Marcos (Opcional)</label>
                        <input
                            className="input-field"
                            id="projectPhases"
                            name="projectPhases"
                            placeholder="Ex: 1. Setup, 2. Design, 3. Dev"
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                    {loading ? (
                        <span className="flex-center">
                            <div className="spinner"></div> Gerando Proposta com IA...
                        </span>
                    ) : (
                        '✨ Gerar Proposta em 60s'
                    )}
                </button>
            </form>
        </div>
    );
}
