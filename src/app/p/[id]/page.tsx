import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import ViewTracker from './ViewTracker';
import SignatureSection from './SignatureSection';
import FeedbackSection from './FeedbackSection';
import '@/app/dashboard/proposal/[id]/editor.css';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params;
    const proposal = await getProposal(id);
    if (!proposal) return { title: 'Proposta não encontrada' };

    return {
        title: `Proposta para ${proposal.client_name} - ${proposal.service_type}`,
        description: `Confira a proposta comercial personalizada para ${proposal.client_name}. Gerado de forma profissional com PropostaAI.`,
    };
}

async function getProposal(id: string) {
    try {
        const supabase = await createClient();
        const { data: proposal, error } = await supabase
            .from('proposals')
            .select('id, user_id, client_name, service_type, content, status, signature_name, signature_date, signature_ip, enable_billing, billing_amount')
            .eq('id', id)
            .single();

        if (error || !proposal) return null;
        // ... (rest of the function same, just selective replacing below)
        const { data: userData } = await supabase
            .from('users')
            .select('plan, brand_color, brand_logo_url')
            .eq('id', proposal.user_id)
            .single();

        const plan = userData?.plan || 'starter';
        const isPro = plan === 'pro' || plan === 'agency';

        return {
            ...proposal,
            branding: isPro ? {
                color: userData?.brand_color || '#22c55e',
                logo: userData?.brand_logo_url || null
            } : {
                color: '#22c55e',
                logo: null
            }
        };
    } catch (e) {
        return null;
    }
}

// ...

export default async function PublicProposalPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const proposal = await getProposal(id);

    if (!proposal) {
        notFound();
    }

    const brandColor = proposal.branding.color;
    const brandLogo = proposal.branding.logo;

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto', '--primary': brandColor } as React.CSSProperties}>
            <ViewTracker proposalId={id} />

            <div className="proposal-content glass-card" style={{ padding: '3rem', borderTop: `4px solid ${brandColor}` }}>
                {/* ... */}
                <div className="proposal-paper-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="header-left">
                        {brandLogo ? (
                            <img src={brandLogo} alt="Logo da Empresa" style={{ maxHeight: '50px', maxWidth: '200px', objectFit: 'contain' }} />
                        ) : (
                            <div className="brand-name" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Proposta Comercial</div>
                        )}
                    </div>
                </div>

                <div className="paper-info-bar" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div className="info-item">
                        <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)' }}>Preparado para</span>
                        <span className="value" style={{ fontWeight: 600 }}>{proposal.client_name}</span>
                    </div>
                    <div className="info-item">
                        <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)' }}>Serviço</span>
                        <span className="value" style={{ fontWeight: 600 }}>{proposal.service_type}</span>
                    </div>
                    <div className="info-item" style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)' }}>Gerado com</span>
                        <span className="value" style={{ fontWeight: 600, color: 'var(--primary)' }}>Proposta Fácil</span>
                    </div>
                </div>

                <div className="paper-body">
                    <div className="markdown-preview" style={{ lineHeight: 1.6 }}>
                        <ReactMarkdown>{proposal.content}</ReactMarkdown>
                    </div>
                </div>

                <FeedbackSection
                    proposalId={id}
                    accentColor={brandColor}
                />

                <SignatureSection
                    proposalId={id}
                    initialStatus={proposal.status}
                    signatureName={proposal.signature_name}
                    signatureDate={proposal.signature_date}
                    signatureIp={proposal.signature_ip}
                    enableBilling={proposal.enable_billing}
                    billingAmount={proposal.billing_amount}
                    accentColor={brandColor}
                />
            </div>
        </div>
    );
}
