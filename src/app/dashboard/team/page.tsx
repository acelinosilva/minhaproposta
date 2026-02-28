import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

export default async function TeamPage() {
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
                title="Gestão de Equipe"
                description="Convide membros, atribua permissões e colabore em propostas (até 5 usuários)."
                icon="👥"
                requiredPlan="agency"
                userPlan={plan}
            />
        );
    }

    const { data: teamMembers } = await supabase
        .from('team_members')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true });

    async function addMember(formData: FormData) {
        'use server';
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        if (!name || !email) return;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Limiting to 5 members max to simulate Agency plan tier limit
        const { count } = await supabase
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user?.id || '');

        if (user && (count || 0) < 5) {
            await supabase
                .from('team_members')
                .insert([{ owner_id: user.id, name, email }]);
            revalidatePath('/dashboard/team');
        }
    }

    async function removeMember(formData: FormData) {
        'use server';
        const memberId = formData.get('memberId') as string;
        if (!memberId) return;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId)
                .eq('owner_id', user.id);
            revalidatePath('/dashboard/team');
        }
    }

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>👥</span> Minha Equipe
                    </h1>
                    <p className="text-muted">Gerencie os acessos e colaboradores da sua agência (limite de 5).</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Membros Ativos ({teamMembers?.length || 0}/5)</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {teamMembers?.length === 0 ? (
                            <div className="text-muted" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--c-border)' }}>
                                Nenhum membro adicionado ainda.
                            </div>
                        ) : (
                            teamMembers?.map((member) => (
                                <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--c-background-soft)', borderRadius: '8px', border: '1px solid var(--c-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{member.name}</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{member.email}</div>
                                    </div>
                                    <form action={removeMember}>
                                        <input type="hidden" name="memberId" value={member.id} />
                                        <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
                                            Remover
                                        </button>
                                    </form>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Convidar Novo Usuário</h2>

                    {(teamMembers?.length || 0) >= 5 ? (
                        <div style={{ padding: '1.5rem', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                            Você atingiu o limite máximo de 5 membros para a sua conta Agência.
                        </div>
                    ) : (
                        <form action={addMember} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="label">Nome do Colaborador</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Ex: Ana Silva"
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="ana@suaagencia.com"
                                    className="input-field"
                                />
                                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                    Um convite será enviado (Simulação).
                                </p>
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                                Adicionar Membro
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </div>
    );
}
