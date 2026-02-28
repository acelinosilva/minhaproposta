import { createClient } from '@/utils/supabase/server';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats
    const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    const { count: proposalCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true });

    const { data: plans } = await supabase
        .from('users')
        .select('plan');

    const planStats = {
        starter: plans?.filter(u => u.plan === 'starter').length || 0,
        pro: plans?.filter(u => u.plan === 'pro').length || 0,
        agency: plans?.filter(u => u.plan === 'agency').length || 0,
    };

    return (
        <div className="admin-dashboard">
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-value text-gradient">{userCount || 0}</div>
                    <div className="stat-label">Total de Usuários</div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-value text-gradient">{proposalCount || 0}</div>
                    <div className="stat-label">Propostas Geradas</div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-value text-gradient">{planStats.pro + planStats.agency}</div>
                    <div className="stat-label">Assinantes Pagos</div>
                </div>
            </div>

            <section className="dashboard-section">
                <h2 className="section-title">Distribuição de Planos</h2>
                <div className="plans-distribution stats-grid">
                    <div className="stat-card glass-panel">
                        <div className="stat-value">{planStats.starter}</div>
                        <div className="stat-label">Starter (Free)</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <div className="stat-value" style={{ color: 'var(--color-primary)' }}>{planStats.pro}</div>
                        <div className="stat-label">Pro</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <div className="stat-value" style={{ color: '#f59e0b' }}>{planStats.agency}</div>
                        <div className="stat-label">Agency</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
