import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        // Increment time by 30 seconds (standard heartbeat)
        const { error } = await supabase.rpc('increment_proposal_time', {
            proposal_id: id,
            seconds: 30
        });

        // Fallback if RPC doesn't exist yet (though I should create it)
        if (error) {
            const { data: proposal } = await supabase
                .from('proposals')
                .select('total_time_spent')
                .eq('id', id)
                .single();

            await supabase
                .from('proposals')
                .update({
                    total_time_spent: (proposal?.total_time_spent || 0) + 30,
                    last_heartbeat_at: new Date().toISOString()
                })
                .eq('id', id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
