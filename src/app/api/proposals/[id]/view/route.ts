import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: proposal, error: fetchError } = await supabase
            .from('proposals')
            .select('view_count, first_view_notified, user_id, client_name')
            .eq('id', id)
            .single();

        if (fetchError || !proposal) {
            return NextResponse.json(
                { error: 'Proposta não encontrada' },
                { status: 404 }
            );
        }

        const newViewCount = (proposal.view_count || 0) + 1;
        let shouldNotify = !proposal.first_view_notified;

        // Atualizar
        const { error: updateError } = await supabase
            .from('proposals')
            .update({
                view_count: newViewCount,
                last_viewed_at: new Date().toISOString(),
                first_view_notified: true
            })
            .eq('id', id);

        if (updateError) {
            console.error('Erro ao atualizar view da proposta:', updateError);
            return NextResponse.json(
                { error: 'Erro ao registrar visualização' },
                { status: 500 }
            );
        }

        if (shouldNotify) {
            console.log(`[SIMULAÇÃO E-MAIL] Enviando alerta para o usuário ${proposal.user_id}: "Sua proposta para ${proposal.client_name} acabou de ser aberta pela primeira vez!"`);
        }

        return NextResponse.json({ success: true, view_count: newViewCount });
    } catch (error) {
        console.error('Erro geral no tracking:', error);
        return NextResponse.json(
            { error: 'Erro interno' },
            { status: 500 }
        );
    }
}
