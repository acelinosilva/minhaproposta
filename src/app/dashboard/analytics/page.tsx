import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: userData } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

    const plan = userData?.plan || 'starter';
    const isPro = plan === 'pro' || plan === 'agency';

    if (!isPro) {
        return (
            <FeaturePlaceholder
                title="Análise de ROI"
                description="Acompanhe o retorno financeiro e métricas de conversão detalhadas."
                icon="📈"
                requiredPlan="pro"
                userPlan={plan}
            />
        );
    }

    // Fetch all proposals for the user to calculate metrics
    const { data: proposals } = await supabase
        .from('proposals')
        .select('status, view_count, created_at')
        .eq('user_id', user.id);

    const totalProposals = proposals?.length || 0;
    const totalViews = proposals?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;
    const approvedProposals = proposals?.filter(p => p.status === 'approved').length || 0;
    const sentProposals = proposals?.filter(p => p.status === 'sent').length || 0;

    // Simplistic conversion rate: Approved / (Approved + Sent) to avoid punishing drafts
    const validForConversion = approvedProposals + sentProposals;
    const conversionRate = validForConversion > 0
        ? Math.round((approvedProposals / validForConversion) * 100)
        : 0;

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📈</span> Análise de ROI
                    </h1>
                    <p className="text-muted">Acompanhe a performance geral das suas propostas e taxa de fechamento.</p>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--c-zinc)' }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--c-zinc)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Criadas</span>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{totalProposals}</div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #60a5fa' }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--c-zinc)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Visualizações</span>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{totalViews}</div>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Soma de aberturas dos clientes</p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--c-green)' }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--c-zinc)', textTransform: 'uppercase', letterSpacing: '1px' }}>Propostas Aprovadas</span>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--c-green)' }}>{approvedProposals}</div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--c-primary)' }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--c-zinc)', textTransform: 'uppercase', letterSpacing: '1px' }}>Taxa de Conversão</span>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--c-primary)' }}>{conversionRate}%</div>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Aprovadas vs Enviadas</p>
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Dica do Sistema</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem' }}>💡</span>
                    <p className="text-muted" style={{ lineHeight: 1.6 }}>
                        Sua taxa de conversão mede a eficiência das suas propostas enviadas. Para aumentar este número, utilize os nossos <strong>Templates de alta conversão</strong> ou garanta um <em>follow-up</em> rápido assim que o painel marcar que o cliente visualizou a proposta.
                    </p>
                </div>
            </div>
        </div>
    );
}
