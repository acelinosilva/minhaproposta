import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProposalEditor from './ProposalEditor';
import PdfExportButton from './PdfExportButton';
import ShareProposalPanel from './ShareProposalPanel';

export default async function ProposalPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: proposal, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !proposal) {
        notFound();
    }

    const { data: userData } = await supabase
        .from('users')
        .select('plan')
        .eq('id', proposal.user_id)
        .single();

    const { data: snippets } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', proposal.user_id)
        .order('created_at', { ascending: true });

    return (
        <div className="proposal-view-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient">Proposta: {proposal.client_name}</h1>
                    <p className="text-muted">Serviço: {proposal.service_type}</p>
                </div>

                <PdfExportButton filename={'Proposta_' + proposal.client_name.split(' ').join('_')} />
            </div>

            <ShareProposalPanel
                proposalId={proposal.id}
                viewCount={proposal.view_count}
                lastViewedAt={proposal.last_viewed_at}
                timeSpent={proposal.total_time_spent}
                feedbackCount={proposal.client_feedback?.length || 0}
                clientName={proposal.client_name}
                serviceType={proposal.service_type}
            />

            <ProposalEditor
                initialProposal={proposal}
                userPlan={userData?.plan || 'starter'}
                snippets={snippets || []}
            />
        </div>
    );
}
