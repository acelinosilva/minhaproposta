import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { signout } from '@/app/login/actions';
import './dashboard.css';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: userData } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

    const userPlan = userData?.plan || 'starter';
    const isPro = userPlan === 'pro' || userPlan === 'agency';
    const isAgency = userPlan === 'agency';

    return (
        <div className="dashboard-layout">
            <aside className="sidebar glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between', paddingBottom: '20px' }}>
                <div>
                    <div className="sidebar-header">
                        <h2 className="text-gradient">PropostaAI</h2>
                    </div>

                    <nav className="sidebar-nav">
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--c-zinc)', margin: '1rem 0 0.5rem 1rem' }}>Principal</div>
                        <a href="/dashboard" className="nav-item">📝 Nova Proposta</a>
                        <a href="/dashboard/history" className="nav-item">📚 Histórico</a>

                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--c-primary)', margin: '1.5rem 0 0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: 'var(--c-zinc)' }}>Recursos</span>
                            <span style={{ fontSize: '0.65rem', background: 'var(--c-green-dim)', color: 'var(--c-green)', padding: '2px 6px', borderRadius: '4px' }}>PRO</span>
                        </div>
                        <a href="/dashboard/snippets" className="nav-item" style={{ opacity: isPro ? 1 : 0.6 }}>
                            📋 Meus Snippets {isPro ? '' : '🔒'}
                        </a>
                        <a href="/dashboard/branding" className="nav-item" style={{ opacity: isPro ? 1 : 0.6 }}>
                            🎨 Branding {isPro ? '' : '🔒'}
                        </a>
                        <a href="/dashboard/analytics" className="nav-item" style={{ opacity: isPro ? 1 : 0.6 }}>
                            📈 Análise de ROI {isPro ? '' : '🔒'}
                        </a>

                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--c-zinc)', margin: '1.5rem 0 0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>Agência</span>
                            <span style={{ fontSize: '0.65rem', background: 'rgba(255,180,0,0.15)', color: '#ffb400', padding: '2px 6px', borderRadius: '4px' }}>👑</span>
                        </div>
                        <a href="/dashboard/templates" className="nav-item" style={{ opacity: isAgency ? 1 : 0.6 }}>
                            📄 Templates {isAgency ? '' : '🔒'}
                        </a>
                        <a href="/dashboard/team" className="nav-item" style={{ opacity: isAgency ? 1 : 0.6 }}>
                            👥 Minha Equipe {isAgency ? '' : '🔒'}
                        </a>
                        <a href="/dashboard/reports" className="nav-item" style={{ opacity: isAgency ? 1 : 0.6 }}>
                            📊 Relatórios {isAgency ? '' : '🔒'}
                        </a>
                        <a href="/dashboard/support" className="nav-item" style={{ opacity: isAgency ? 1 : 0.6 }}>
                            📞 Gerente VIP {isAgency ? '' : '🔒'}
                        </a>

                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--c-zinc)', margin: '1.5rem 0 0.5rem 1rem' }}>Conta</div>
                        <a href="/settings" className="nav-item">⚙️ Configurações</a>
                    </nav>
                </div>

                <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
                    <div className="user-info">
                        <span className="user-email">{user.email}</span>
                    </div>
                    <form action={signout}>
                        <button className="btn-secondary logout-btn">Sair</button>
                    </form>
                </div>
            </aside>

            <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
