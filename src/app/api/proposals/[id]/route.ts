import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: proposal, error } = await supabase
            .from('proposals')
            .select('id, client_name, service_type, content, status')
            .eq('id', id)
            .single();

        if (error || !proposal) {
            return NextResponse.json(
                { error: 'Proposta não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(proposal);
    } catch (error) {
        console.error('Erro ao buscar proposta:', error);
        return NextResponse.json(
            { error: 'Erro interno ao buscar proposta' },
            { status: 500 }
        );
    }
}
