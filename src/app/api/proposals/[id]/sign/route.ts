import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { fullName } = await request.json();

        if (!fullName) {
            return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
        }

        const supabase = await createClient();

        // Get IP address from headers
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

        const { data: proposal, error: fetchError } = await supabase
            .from('proposals')
            .select('webhook_url, client_name')
            .eq('id', id)
            .single();

        if (fetchError || !proposal) {
            return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
        }

        const { error } = await supabase
            .from('proposals')
            .update({
                status: 'accepted',
                signature_name: fullName,
                signature_ip: ip,
                signature_date: new Date().toISOString(),
                pending_approval: false // Auto-clear approval if it's signed (client is the final word)
            })
            .eq('id', id);

        if (error) {
            console.error('Erro ao assinar proposta:', error);
            return NextResponse.json({ error: 'Erro ao assinar' }, { status: 500 });
        }

        if (proposal.webhook_url) {
            console.log(`[SIMULAÇÃO WEBHOOK] Despachando POST para ${proposal.webhook_url} com os dados da assinatura de ${proposal.client_name}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro no endpoint de assinatura:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
