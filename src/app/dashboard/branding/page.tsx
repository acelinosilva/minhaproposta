import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

export default async function BrandingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    const plan = userData?.plan || 'starter';
    const isPro = plan === 'pro' || plan === 'agency';

    if (!isPro) {
        return (
            <FeaturePlaceholder
                title="Branding Customizado"
                description="Personalize cores, fontes e logo das suas propostas comerciais."
                icon="🎨"
                requiredPlan="pro"
                userPlan={plan}
            />
        );
    }

    async function saveBranding(formData: FormData) {
        'use server';
        const brandColor = formData.get('color') as string;
        const brandLogo = formData.get('logo') as string;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase
                .from('users')
                .update({ brand_color: brandColor, brand_logo_url: brandLogo })
                .eq('id', user.id);
            revalidatePath('/dashboard/branding');
        }
    }

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🎨</span> Branding
                    </h1>
                    <p className="text-muted">Personalize a aparência das suas propostas públicas.</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <section className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Identidade Visual</h2>
                    <form action={saveBranding} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="label">Cor Principal</label>
                            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                Esta cor será usada nos botões, links e detalhes de destaque da sua proposta. (Padrão: Verde PropostaFacil)
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    name="color"
                                    defaultValue={userData?.brand_color || '#22c55e'}
                                    style={{
                                        width: '60px',
                                        height: '40px',
                                        padding: '0',
                                        border: '1px solid var(--c-border)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        background: 'transparent'
                                    }}
                                />
                                <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--c-zinc)' }}>
                                    {userData?.brand_color || '#22c55e'}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">URL do Logotipo</label>
                            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                Insira o link direto de uma imagem hospedada (JPG, PNG, SVG) para substituir nosso texto no cabeçalho.
                            </p>
                            <input
                                type="url"
                                name="logo"
                                placeholder="https://exemplo.com/meu-logo.png"
                                defaultValue={userData?.brand_logo_url || ''}
                                className="input-field"
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: 'fit-content' }}>
                            Salvar Identidade Visual
                        </button>
                    </form>
                </section>

                <section className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Pré-visualização do Cabeçalho</h3>
                    <div style={{
                        padding: '1.5rem',
                        border: '1px solid var(--c-border)',
                        background: '#111',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {userData?.brand_logo_url ? (
                            <img
                                src={userData.brand_logo_url}
                                alt="Seu Logotipo"
                                style={{ maxHeight: '40px', maxWidth: '200px', objectFit: 'contain' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Sua Marca</div>
                        )}

                        <div style={{ width: '80px', height: '8px', background: userData?.brand_color || '#22c55e', borderRadius: '4px' }}></div>
                    </div>
                </section>
            </div>
        </div>
    );
}
