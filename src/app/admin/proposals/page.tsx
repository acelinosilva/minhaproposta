import { createClient } from '@/utils/supabase/server';

export default async function AdminProposals() {
    const supabase = await createClient();

    // Fetch proposals with user details
    const { data: proposals, error } = await supabase
        .from('proposals')
        .select(`
            id,
            client_name,
            service_type,
            status,
            created_at,
            user_id,
            users (
                email,
                name
            )
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="admin-proposals-page">
            <h2 className="section-title">Monitoramento de Propostas</h2>

            <div className="data-table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Usuário</th>
                            <th>Status</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals?.map((proposal) => (
                            <tr key={proposal.id}>
                                <td>{proposal.client_name}</td>
                                <td>{proposal.service_type}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500 }}>
                                            {(proposal.users as any)?.name || (proposal.users as any)?.[0]?.name || 'N/A'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                            {(proposal.users as any)?.email || (proposal.users as any)?.[0]?.email}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: proposal.status === 'completed' ? '#dcfce7' : '#fef9c3',
                                        color: proposal.status === 'completed' ? '#166534' : '#854d0e'
                                    }}>
                                        {proposal.status === 'completed' ? 'Concluída' : 'Rascunho'}
                                    </span>
                                </td>
                                <td>{new Date(proposal.created_at).toLocaleDateString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
