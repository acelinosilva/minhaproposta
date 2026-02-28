import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import CheckoutButton from '@/components/CheckoutButton';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    async function updateProfile(formData: FormData) {
        'use server';
        const name = formData.get('name') as string;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase
                .from('users')
                .update({ name })
                .eq('id', user.id);
            revalidatePath('/settings');
        }
    }

    async function manualPlanOverrideAdmin(formData: FormData) {
        'use server';
        const newPlan = formData.get('plan') as string;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Verify if user is really admin before allowing override
            const { data: checkAdmin } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            if (checkAdmin?.role === 'admin') {
                await supabase
                    .from('users')
                    .update({ plan: newPlan })
                    .eq('id', user.id);
                revalidatePath('/settings');
            }
        }
    }

    return (
        <div className="settings-container">
            <h1 className="text-gradient">Configurações</h1>
            <p className="text-muted">Gerencie suas informações e preferências.</p>

            <div className="settings-grid" style={{ marginTop: '2rem', display: 'grid', gap: '2rem' }}>
                <section className="settings-section glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Perfil</h2>
                    <form action={updateProfile} className="settings-form" style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
                        <div className="form-group">
                            <label className="label">Nome</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={userData?.name || ''}
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="input-field"
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Salvar Alterações</button>
                    </form>
                </section>

                <section className="settings-section glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Plano e Assinatura</h2>
                    <div className="plan-info" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                Plano Atual: <span className={`badge badge-${userData?.plan}`} style={{ marginLeft: '8px' }}>{userData?.plan?.toUpperCase()}</span>
                            </p>
                            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
                                Você possui <strong>{userData?.credits}</strong> créditos disponíveis para gerar propostas com IA.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, minWidth: '300px' }}>
                            {userData?.plan === 'starter' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--c-green)' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Profissional</h3>
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>R$ 97/mês — cancele quando quiser</p>
                                        </div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <li>✓ Propostas ilimitadas</li>
                                            <li>✓ Motor IA de alta conversão</li>
                                            <li>✓ Rastreamento em tempo real</li>
                                            <li>✓ Branding customizado</li>
                                            <li>✓ Análise de ROI integrada</li>
                                            <li>✓ Suporte prioritário</li>
                                        </ul>
                                        <CheckoutButton priceId={process.env.STRIPE_PRICE_PROFESSIONAL || ''} className="btn-primary" style={{ marginTop: 'auto' }}>
                                            Assinar Profissional
                                        </CheckoutButton>
                                    </div>

                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Agência</h3>
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>R$ 197/mês — até 5 usuários</p>
                                        </div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <li>✓ Tudo do Profissional</li>
                                            <li>✓ 5 usuários incluídos</li>
                                            <li>✓ IA treinada no seu nicho</li>
                                            <li>✓ Templates exclusivos</li>
                                            <li>✓ Relatórios de equipe</li>
                                            <li>✓ Gerente de conta dedicado</li>
                                        </ul>
                                        <CheckoutButton priceId={process.env.STRIPE_PRICE_AGENCY || ''} className="btn-secondary" style={{ marginTop: 'auto' }}>
                                            Assinar Agência
                                        </CheckoutButton>
                                    </div>
                                </div>
                            )}

                            {userData?.plan === 'pro' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--c-green)' }}>Seu Plano: Profissional</h3>
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Propostas de alta conversão</p>
                                        </div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <li>✓ Propostas ilimitadas</li>
                                            <li>✓ Motor IA de alta conversão</li>
                                            <li>✓ Rastreamento em tempo real</li>
                                            <li>✓ Branding customizado</li>
                                            <li>✓ Análise de ROI integrada</li>
                                            <li>✓ Suporte prioritário</li>
                                        </ul>
                                    </div>

                                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--c-green)' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Upgrade: Agência</h3>
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>R$ 197/mês — até 5 usuários</p>
                                        </div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <li>✓ Tudo do Profissional</li>
                                            <li>✓ 5 usuários incluídos</li>
                                            <li>✓ IA treinada no seu nicho</li>
                                            <li>✓ Templates exclusivos</li>
                                            <li>✓ Relatórios de equipe</li>
                                            <li>✓ Gerente de conta dedicado</li>
                                        </ul>
                                        <CheckoutButton priceId={process.env.STRIPE_PRICE_AGENCY || ''} className="btn-primary" style={{ marginTop: 'auto' }}>
                                            Fazer Upgrade para Agência
                                        </CheckoutButton>
                                    </div>
                                </div>
                            )}

                            {userData?.plan === 'agency' && (
                                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--c-green)', maxWidth: '400px' }}>
                                    <div>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>👑</span>
                                            <h3 style={{ fontSize: '1.2rem', color: 'var(--c-green)' }}>Seu Plano: Agência</h3>
                                        </div>
                                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Acesso total a todos os recursos ilimitados.</p>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                                        <li>✓ Propostas ilimitadas e Motor IA avançado</li>
                                        <li>✓ Rastreamento em tempo real e Branding</li>
                                        <li>✓ 5 usuários incluídos</li>
                                        <li>✓ IA treinada no seu nicho</li>
                                        <li>✓ Templates exclusivos de alta conversão</li>
                                        <li>✓ Relatórios de performance de equipe</li>
                                        <li>✓ Gerente de conta dedicado</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {userData?.role === 'admin' && (
                    <section className="settings-section glass-panel" style={{ padding: '2rem', border: '1px solid var(--color-primary)' }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--color-primary)' }}>Privilégios Administrativos</h2>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1.5rem' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Painel Geral</h3>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                                    Você tem acesso total ao painel de controle do sistema para gerenciar usuários e visualizar dados.
                                </p>
                                <a href="/admin" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Acessar Painel Admin</a>
                            </div>

                            <div style={{ flex: 1, minWidth: '250px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Alteração Manual (Apenas testes)</h3>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                                    Altere seu próprio plano instantaneamente sem precisar passar pelo Checkout do Stripe.
                                </p>
                                <form action={manualPlanOverrideAdmin} style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select name="plan" defaultValue={userData?.plan} className="input-field" style={{ flex: 1 }}>
                                        <option value="starter">Starter</option>
                                        <option value="pro">Pro (Profissional)</option>
                                        <option value="agency">Agency (Agência)</option>
                                    </select>
                                    <button type="submit" className="btn-secondary">Aplicar</button>
                                </form>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
