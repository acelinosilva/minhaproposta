import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

export default async function ReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: userData } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

    const plan = userData?.plan || 'starter';
    const isAgency = plan === 'agency';

    if (!isAgency) {
        return (
            <FeaturePlaceholder
                title="Relatórios de Agência"
                description="Desempenho por consultor, funil completo de vendas e análises exportáveis."
                icon="📊"
                requiredPlan="agency"
                userPlan={plan}
            />
        );
    }

    // Fetch all proposals to generate the report
    const { data: proposals } = await supabase
        .from('proposals')
        .select('status, view_count, client_name')
        .eq('user_id', user.id);

    const total = proposals?.length || 0;
    const sent = proposals?.filter(p => p.status === 'sent').length || 0;
    const approved = proposals?.filter(p => p.status === 'approved').length || 0;
    const rejected = proposals?.filter(p => p.status === 'rejected').length || 0;
    const draft = proposals?.filter(p => p.status === 'draft').length || 0;

    const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;
    const sentPct = total > 0 ? Math.round((sent / total) * 100) : 0;
    const rejectedPct = total > 0 ? Math.round((rejected / total) * 100) : 0;
    const draftPct = total > 0 ? Math.round((draft / total) * 100) : 0;

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📊</span> Relatórios da Agência
                    </h1>
                    <p className="text-muted">Desempenho consolidado do seu funil e da equipe.</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <section className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Funil de Propostas (Visão Geral)</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* BRUTALIST PROGRESS BAR - APPROVED */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                <span>Aprovadas 🎉</span>
                                <span style={{ color: 'var(--c-green)' }}>{approved} ({approvedPct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '32px', background: 'rgba(34, 197, 94, 0.1)', border: '2px solid var(--c-green)', position: 'relative' }}>
                                <div style={{
                                    width: `${approvedPct}%`,
                                    height: '100%',
                                    background: 'var(--c-green)',
                                    transition: 'width 1s ease-in-out'
                                }}></div>
                            </div>
                        </div>

                        {/* BRUTALIST PROGRESS BAR - SENT */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                <span>Enviadas / Aguardando 👀</span>
                                <span style={{ color: '#60a5fa' }}>{sent} ({sentPct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '32px', background: 'rgba(96, 165, 250, 0.1)', border: '2px solid #60a5fa', position: 'relative' }}>
                                <div style={{
                                    width: `${sentPct}%`,
                                    height: '100%',
                                    background: '#60a5fa',
                                    transition: 'width 1s ease-in-out'
                                }}></div>
                            </div>
                        </div>

                        {/* BRUTALIST PROGRESS BAR - DRAFT */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                <span style={{ color: 'var(--c-zinc)' }}>Rascunhos 📝</span>
                                <span style={{ color: 'var(--c-zinc)' }}>{draft} ({draftPct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '32px', background: 'rgba(255, 255, 255, 0.02)', border: '2px solid var(--c-zinc)', position: 'relative' }}>
                                <div style={{
                                    width: `${draftPct}%`,
                                    height: '100%',
                                    background: 'var(--c-zinc)',
                                    opacity: 0.5,
                                    transition: 'width 1s ease-in-out'
                                }}></div>
                            </div>
                        </div>

                        {/* BRUTALIST PROGRESS BAR - REJECTED */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                <span style={{ color: '#f87171' }}>Recusadas ❌</span>
                                <span style={{ color: '#f87171' }}>{rejected} ({rejectedPct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '32px', background: 'rgba(248, 113, 113, 0.1)', border: '2px solid #f87171', position: 'relative' }}>
                                <div style={{
                                    width: `${rejectedPct}%`,
                                    height: '100%',
                                    background: '#f87171',
                                    transition: 'width 1s ease-in-out'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🔥</span> Top Engajamento
                    </h3>
                    <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Propostas com mais visualizações pelos clientes.
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {proposals?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5).map((p, idx) => (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--c-border)' }}>
                                <span style={{ fontWeight: 'bold' }}>{p.client_name}</span>
                                <span style={{ background: 'var(--c-zinc)', color: 'var(--c-background)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {p.view_count} views
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="glass-panel" style={{ padding: '2rem', height: 'fit-content', background: 'var(--c-primary-dim)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--c-primary)' }}>Exportar Dados</h3>
                    <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                        Gere um relatório completo em CSV ou PDF para reuniões de conselho.
                    </p>
                    <button className="btn-primary" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                        Exportar PDF (Em breve)
                    </button>
                    <button className="btn-outline" style={{ width: '100%', marginTop: '1rem', opacity: 0.5, cursor: 'not-allowed' }}>
                        Exportar CSV (Em breve)
                    </button>
                </section>
            </div>
        </div>
    );
}
