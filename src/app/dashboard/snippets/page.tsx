import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

export default async function SnippetsPage() {
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
                title="Blocos Reutilizáveis (Snippets)"
                description="Salve trechos de texto como 'Termos de Contrato' ou 'Quem Somos' para inserir rapidamente em novas propostas com 1 clique."
                icon="📋"
                requiredPlan="pro"
                userPlan={plan}
            />
        );
    }

    const { data: snippets } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    async function addSnippet(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) return;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase
                .from('snippets')
                .insert([{ user_id: user.id, title, content }]);
            revalidatePath('/dashboard/snippets');
        }
    }

    async function removeSnippet(formData: FormData) {
        'use server';
        const snippetId = formData.get('snippetId') as string;
        if (!snippetId) return;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase
                .from('snippets')
                .delete()
                .eq('id', snippetId)
                .eq('user_id', user.id);
            revalidatePath('/dashboard/snippets');
        }
    }

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📋</span> Meus Snippets
                    </h1>
                    <p className="text-muted">Gerencie blocos de texto rápidos para inserir nas suas propostas.</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Snippets Salvos ({snippets?.length || 0})</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {snippets?.length === 0 ? (
                            <div className="text-muted" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--c-border)' }}>
                                Nenhum snippet criado ainda.
                            </div>
                        ) : (
                            snippets?.map((snippet) => (
                                <div key={snippet.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', background: 'var(--c-background-soft)', borderRadius: '8px', border: '1px solid var(--c-border)' }}>
                                    <div style={{ flex: 1, paddingRight: '1rem' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{snippet.title}</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {snippet.content}
                                        </div>
                                    </div>
                                    <form action={removeSnippet} style={{ flexShrink: 0 }}>
                                        <input type="hidden" name="snippetId" value={snippet.id} />
                                        <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
                                            Excluir
                                        </button>
                                    </form>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Criar Novo Snippet</h2>

                    <form action={addSnippet} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="label">Título Curto</label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="Ex: Termos e Condições"
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Conteúdo (Markdown suportado)</label>
                            <textarea
                                name="content"
                                required
                                placeholder="Insira o texto longo..."
                                className="input-field"
                                rows={6}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                            Salvar Bloco
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
