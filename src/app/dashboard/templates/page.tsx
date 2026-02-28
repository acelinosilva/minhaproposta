import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

const TEMPLATES = [
    {
        id: 't1',
        name: 'Design & Desenvolvimento Web',
        description: 'Estrutura focada em escopo de projeto, cronogramas e entregáveis técnicos.',
        icon: '💻',
        color: '#3b82f6'
    },
    {
        id: 't2',
        name: 'Gestão de Tráfego Pago',
        description: 'Modelo comprovado para apresentar ROI estimado, orçamento de mídia e setup.',
        icon: '🚀',
        color: '#f59e0b'
    },
    {
        id: 't3',
        name: 'Consultoria Empresarial',
        description: 'Linguagem corporativa para projetos de reestruturação de processos.',
        icon: '📊',
        color: '#10b981'
    },
    {
        id: 't4',
        name: 'Social Media & Conteúdo',
        description: 'Proposta visual enfatizando cronograma de postagens e gestão de comunidade.',
        icon: '📱',
        color: '#ec4899'
    }
];

export default async function TemplatesPage() {
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
                title="Templates Exclusivos"
                description="Acesso ao catálogo de templates premium de alta conversão testados no mercado."
                icon="📄"
                requiredPlan="agency"
                userPlan={plan}
            />
        );
    }

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📄</span> Templates Exclusivos
                    </h1>
                    <p className="text-muted">Comece rapidamente usando nossas estruturas testadas pelo mercado.</p>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {TEMPLATES.map((tpl) => (
                    <div key={tpl.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', borderTop: `4px solid ${tpl.color}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(255,255,255,0.05)', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                {tpl.icon}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.3 }}>{tpl.name}</h3>
                        </div>

                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5, flex: 1 }}>
                            {tpl.description}
                        </p>

                        <Link
                            href={`/dashboard?template=${tpl.id}`}
                            className="btn-outline"
                            style={{ textAlign: 'center', width: '100%', borderColor: tpl.color, color: tpl.color }}
                        >
                            Usar Template
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
