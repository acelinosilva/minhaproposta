'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/utils/supabase/client';
import './editor.css';

export default function ProposalEditor({
    initialProposal,
    userPlan = 'starter',
    snippets = []
}: {
    initialProposal: any;
    userPlan?: string;
    snippets?: any[];
}) {
    const [content, setContent] = useState(initialProposal.content);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSnippets, setShowSnippets] = useState(false);
    const [showBilling, setShowBilling] = useState(false);
    const [enableBilling, setEnableBilling] = useState(initialProposal.enable_billing || false);
    const [billingAmount, setBillingAmount] = useState(initialProposal.billing_amount || 0);
    const [pendingApproval, setPendingApproval] = useState(initialProposal.pending_approval || false);
    const [webhookUrl, setWebhookUrl] = useState(initialProposal.webhook_url || '');

    const supabase = createClient();

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // Versioning logic: if content changed, save old version
            let updatedVersions = initialProposal.versions || [];
            if (content !== initialProposal.content) {
                updatedVersions = [
                    {
                        content: initialProposal.content,
                        saved_at: new Date().toISOString(),
                        user_id: (await supabase.auth.getUser()).data.user?.id
                    },
                    ...updatedVersions
                ].slice(0, 5); // Keep last 5 versions
            }

            const { error } = await supabase
                .from('proposals')
                .update({
                    content,
                    enable_billing: enableBilling,
                    billing_amount: billingAmount,
                    pending_approval: pendingApproval,
                    webhook_url: webhookUrl,
                    versions: updatedVersions,
                    status: pendingApproval ? 'draft' : 'sent'
                })
                .eq('id', initialProposal.id);

            if (error) throw error;
            setIsEditing(false);
            alert('Proposta salva com sucesso!');
        } catch (err) {
            alert('Erro ao salvar proposta');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="editor-container">
            <div className="editor-toolbar glass-panel">
                <div className="toolbar-actions">
                    {isEditing ? (
                        <>
                            <button
                                className="btn-primary btn-sm"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Salvando...' : '💾 Salvar Alterações'}
                            </button>
                            <button
                                className="btn-secondary btn-sm"
                                onClick={() => {
                                    setContent(initialProposal.content);
                                    setIsEditing(false);
                                    setShowSnippets(false);
                                }}
                            >
                                Cancelar
                            </button>
                            <div style={{ position: 'relative' }}>
                                <button
                                    className="btn-outline btn-sm"
                                    onClick={() => setShowBilling(!showBilling)}
                                    style={{
                                        borderColor: enableBilling ? 'var(--color-primary)' : 'var(--color-border)',
                                        color: enableBilling ? 'var(--color-primary)' : 'var(--color-text-primary)',
                                        background: enableBilling ? 'var(--color-primary-dim)' : 'transparent'
                                    }}
                                >
                                    💰 Pagamento {enableBilling ? 'ON' : ''}
                                </button>

                                {showBilling && (
                                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.5rem', width: '300px', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                        {userPlan === 'starter' ? (
                                            <div>
                                                <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                                                    A cobrança integrada é exclusiva para o plano <strong>Profissional</strong>.
                                                </div>
                                                <a href="/settings" className="btn-primary btn-sm" style={{ display: 'block', textAlign: 'center' }}>Fazer Upgrade</a>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <input
                                                        type="checkbox"
                                                        id="enable-billing"
                                                        checked={enableBilling}
                                                        onChange={(e) => setEnableBilling(e.target.checked)}
                                                    />
                                                    <label htmlFor="enable-billing" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Solicitar Pagamento</label>
                                                </div>

                                                {enableBilling && (
                                                    <div className="form-group" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                                                        <label className="label" style={{ fontSize: '0.7rem' }}>Valor do Projeto (R$)</label>
                                                        <input
                                                            type="number"
                                                            className="input-field"
                                                            value={billingAmount}
                                                            onChange={(e) => setBillingAmount(Number(e.target.value))}
                                                            placeholder="0.00"
                                                        />
                                                        <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                                            O cliente verá um botão para pagar via Stripe após assinar.
                                                        </p>
                                                    </div>
                                                )}

                                                {userPlan === 'agency' && (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <input
                                                                type="checkbox"
                                                                id="pending-approval"
                                                                checked={pendingApproval}
                                                                onChange={(e) => setPendingApproval(e.target.checked)}
                                                            />
                                                            <label htmlFor="pending-approval" style={{ fontSize: '0.9rem' }}>Pendente de Aprovação Interna</label>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="label" style={{ fontSize: '0.7rem' }}>Webhook URL (Fase Beta)</label>
                                                            <input
                                                                type="url"
                                                                className="input-field"
                                                                value={webhookUrl}
                                                                onChange={(e) => setWebhookUrl(e.target.value)}
                                                                placeholder="https://sua-api.com/webhook"
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                <button className="btn-primary btn-sm" onClick={() => setShowBilling(false)}>Pronto</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {initialProposal.versions?.length > 0 && (
                                <div style={{ position: 'relative' }}>
                                    <button className="btn-outline btn-sm" style={{ borderColor: 'var(--c-text-muted)', color: 'var(--c-text-muted)' }} onClick={() => alert('Visualização de versões anteriores em breve!')}>
                                        🕒 Histórico ({initialProposal.versions.length})
                                    </button>
                                </div>
                            )}
                            <div style={{ position: 'relative' }}>
                                <button
                                    className="btn-outline btn-sm"
                                    onClick={() => setShowSnippets(!showSnippets)}
                                    style={{
                                        borderColor: 'var(--color-primary)',
                                        color: 'var(--color-primary)',
                                        background: showSnippets ? 'var(--color-primary-dim)' : 'transparent'
                                    }}
                                >
                                    📋 Snippets
                                </button>

                                {showSnippets && (
                                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', width: '300px', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                        {userPlan === 'starter' ? (
                                            <div>
                                                <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                                                    A funcionalidade de <strong>Snippets</strong> é exclusiva para assinantes do plano Profissional ou Agência.
                                                </div>
                                                <a href="/settings" className="btn-primary btn-sm" style={{ display: 'block', textAlign: 'center' }}>Fazer Upgrade</a>
                                            </div>
                                        ) : snippets.length === 0 ? (
                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Nenhum snippet criado ainda. Crie acessando a seção Snippets no menu lateral.</div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                                                {snippets.map(s => (
                                                    <button
                                                        key={s.id}
                                                        className="btn-secondary btn-sm"
                                                        style={{ textAlign: 'left', display: 'block', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        onClick={() => {
                                                            setContent((prev: string) => prev + '\n\n' + s.content);
                                                            setShowSnippets(false);
                                                        }}
                                                    >
                                                        {s.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button
                            className="btn-secondary btn-sm"
                            onClick={() => setIsEditing(true)}
                        >
                            ✏️ Editar Texto
                        </button>
                    )}
                </div>
            </div>

            <div className="proposal-content glass-card" id="proposal-content-pdf">
                {!isEditing && (
                    <>
                        <div className="proposal-paper-header">
                            <div className="header-left">
                                <div className="brand-name">PropostaAI</div>
                            </div>
                            <div className="header-right">
                                <div className="doc-label">Proposta Comercial</div>
                                <div className="doc-date">{new Date(initialProposal.created_at).toLocaleDateString('pt-BR')}</div>
                            </div>
                        </div>

                        <div className="paper-info-bar">
                            <div className="info-item">
                                <span className="label">Preparado para</span>
                                <span className="value">{initialProposal.client_name}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Serviço</span>
                                <span className="value">{initialProposal.service_type}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Status</span>
                                <span className="value">{initialProposal.status === 'draft' ? 'Rascunho' : 'Finalizada'}</span>
                            </div>
                        </div>
                    </>
                )}

                <div className="paper-body">
                    {isEditing ? (
                        <textarea
                            className="input-field content-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    ) : (
                        <div className="markdown-preview">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
