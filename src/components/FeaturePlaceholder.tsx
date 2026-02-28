import React from 'react';
import Link from 'next/link';

interface FeaturePlaceholderProps {
    title: string;
    description: string;
    icon: string;
    requiredPlan: 'pro' | 'agency';
    userPlan: string;
}

export default function FeaturePlaceholder({ title, description, icon, requiredPlan, userPlan }: FeaturePlaceholderProps) {
    const hasAccess = requiredPlan === 'pro'
        ? (userPlan === 'pro' || userPlan === 'agency')
        : userPlan === 'agency';

    if (!hasAccess) {
        return (
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🔒</div>
                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Recurso Premium</h1>
                <p className="text-muted" style={{ maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.6 }}>
                    O recurso de <strong>{title}</strong> é exclusivo para assinantes do plano {requiredPlan === 'agency' ? 'Agência' : 'Profissional'}. Faça upgrade da sua conta para desbloquear esta e outras ferramentas avançadas.
                </p>
                <Link href="/settings" className="btn-primary">
                    Fazer Upgrade Agora
                </Link>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>{icon}</span> {title}
                    </h1>
                    <p className="text-muted">{description}</p>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px dashed var(--c-green)', background: 'rgba(34, 197, 94, 0.02)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--c-green)', marginBottom: '1.5rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Módulo em Desenvolvimento</h2>
                <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Estamos finalizando os últimos ajustes no módulo de <strong>{title}</strong> para garantir a melhor experiência possível. Você terá acesso preferencial assim que for lançado!
                </p>
            </div>
        </div>
    );
}
