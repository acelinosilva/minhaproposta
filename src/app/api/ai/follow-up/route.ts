import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { proposalId } = await req.json();

        // Get proposal metrics
        const { data: proposal, error: fetchError } = await supabase
            .from('proposals')
            .select('*')
            .eq('id', proposalId)
            .single();

        if (fetchError || !proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const { client_name, service_type, view_count, total_time_spent, status } = proposal;
        const timeInMin = Math.round((total_time_spent || 0) / 60);

        const prompt = `
Você é um especialista em vendas e customer success.
Crie 3 opções de mensagens curtas e persuasivas de follow-up (acompanhamento) para serem enviadas via WhatsApp ou E-mail para o cliente "${client_name}" sobre a proposta de "${service_type}".

**CONTEXTO ATUAL DA PROPOSTA:**
- Status: ${status}
- Visualizações: ${view_count}
- Tempo total de leitura: ${timeInMin} minutos
- Último acesso: ${proposal.last_viewed_at || 'Nunca'}

**DIRETRIZES:**
1. Se o cliente já leu muito (ex: > 3 min) mas não assinou, foque em tirar dúvidas e urgência.
2. Se o cliente ainda não abriu (0 views), seja gentil e lembre-o do link.
3. Se o cliente abriu poucas vezes, tente agregar valor ou perguntar o que ele achou.
4. Mantenha um tom profissional, porém humano e direto.

Output format: JSON array of objects with 'type' (WhatsApp/E-mail) and 'text'. Apenas o JSON puro.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from potential markdown blocks
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const followUps = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        return NextResponse.json({ followUps });

    } catch (error: any) {
        console.error("AI Follow-up Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
