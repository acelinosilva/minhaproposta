import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import FollowUpButton from '@/components/FollowUpButton';

export default async function HistoryPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: proposals, error } = await supabase
        .from('proposals')
        .select('id, client_name, service_type, status, created_at, view_count, last_viewed_at, pending_approval')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
    }

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient">Histórico de Propostas</h1>
                    <p className="text-muted">Propostas geradas anteriormente.</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Cliente</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Serviço</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Data</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Status</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Views</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!proposals || proposals.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    Nenhuma proposta encontrada. <Link href="/dashboard" style={{ color: 'var(--color-primary)' }}>Gerar primeira proposta</Link>.
                                </td>
                            </tr>
                        ) : (
                            proposals.map((proposal) => (
                                <tr key={proposal.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                    <td style={{ padding: '1.5rem', fontWeight: 600 }}>{proposal.client_name}</td>
                                    <td style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>{proposal.service_type}</td>
                                    <td style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>
                                        {new Date(proposal.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '0.875rem',
                                            background: proposal.status === 'accepted' ? 'rgba(34, 197, 94, 0.2)' :
                                                proposal.pending_approval ? 'rgba(234, 179, 8, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                                            color: proposal.status === 'accepted' ? '#4ade80' :
                                                proposal.pending_approval ? '#eab308' : '#a5b4fc'
                                        }}>
                                            {proposal.pending_approval ? 'Aguardando Aprovação' :
                                                proposal.status === 'draft' ? 'Rascunho' :
                                                    proposal.status === 'accepted' ? 'Assinada/Paga' :
                                                        proposal.status === 'sent' ? 'Enviada' : proposal.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem', fontWeight: 600 }}>
                                        👁️ {proposal.view_count || 0}
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Link href={`/dashboard/proposal/${proposal.id}`} className="btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                                                Abrir
                                            </Link>
                                            {proposal.status !== 'accepted' && proposal.status !== 'draft' && (
                                                <FollowUpButton clientName={proposal.client_name} serviceType={proposal.service_type} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
