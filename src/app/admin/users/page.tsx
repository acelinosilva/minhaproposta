import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function AdminUsers() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    async function updateCredits(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        const credits = parseInt(formData.get('credits') as string);

        const supabase = await createClient();
        await supabase
            .from('users')
            .update({ credits })
            .eq('id', userId);

        revalidatePath('/admin/users');
    }

    async function updatePlan(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        const plan = formData.get('plan') as string;

        const supabase = await createClient();
        await supabase
            .from('users')
            .update({ plan })
            .eq('id', userId);

        revalidatePath('/admin/users');
    }

    return (
        <div className="admin-users-page">
            <h2 className="section-title">Gerenciamento de Usuários</h2>

            <div className="data-table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Plano</th>
                            <th>Créditos</th>
                            <th>Cadastro</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge badge-${user.plan}`}>
                                        {user.plan.toUpperCase()}
                                    </span>
                                </td>
                                <td>{user.credits}</td>
                                <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <form action={updatePlan} style={{ display: 'flex', gap: '5px' }}>
                                            <input type="hidden" name="userId" value={user.id} />
                                            <select name="plan" defaultValue={user.plan} className="input-field" style={{ padding: '4px', fontSize: '0.8rem' }}>
                                                <option value="starter">Starter</option>
                                                <option value="pro">Pro</option>
                                                <option value="agency">Agency</option>
                                            </select>
                                            <button type="submit" className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Alt</button>
                                        </form>

                                        <form action={updateCredits} style={{ display: 'flex', gap: '5px' }}>
                                            <input type="hidden" name="userId" value={user.id} />
                                            <input
                                                type="number"
                                                name="credits"
                                                defaultValue={user.credits}
                                                className="input-field"
                                                style={{ width: '60px', padding: '4px', fontSize: '0.8rem' }}
                                            />
                                            <button type="submit" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>+ Cr</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
