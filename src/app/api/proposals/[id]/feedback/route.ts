import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { message, author } = await request.json();
        const supabase = await createClient();

        const { data: proposal } = await supabase
            .from('proposals')
            .select('client_feedback')
            .eq('id', id)
            .single();

        const feedback = proposal?.client_feedback || [];
        const newFeedback = [
            ...feedback,
            {
                id: crypto.randomUUID(),
                author: author || 'Cliente',
                message,
                timestamp: new Date().toISOString()
            }
        ];

        const { error } = await supabase
            .from('proposals')
            .update({ client_feedback: newFeedback })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
