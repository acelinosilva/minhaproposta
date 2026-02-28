import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        // 1. Authenticate user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse request body
        const {
            clientName,
            serviceType,
            scope,
            timeframe,
            tone,
            targetAudience,
            keyBenefits,
            projectPhases
        } = await req.json();

        if (!clientName || !serviceType || !scope) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 3. Enforce Limits (Starter Plan)
        const { data: userData } = await supabase
            .from('users')
            .select('plan')
            .eq('id', user.id)
            .single();

        const plan = userData?.plan || 'starter';

        if (plan === 'starter') {
            const { count } = await supabase
                .from('proposals')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .neq('status', 'rejected'); // Only active/draft/sent/approved count

            if (count !== null && count >= 5) {
                return NextResponse.json({
                    error: "Limite atingido",
                    message: "Você atingiu o limite de 5 propostas no plano Starter. Faça upgrade para o plano Profissional para criar propostas ilimitadas!",
                    limitReached: true
                }, { status: 403 });
            }
        }

        // 4. Generate Proposal with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Adjust tone
        let toneInstruction = "profissional e persuasivo";
        if (tone === "formal") toneInstruction = "altamente formal e corporativo";
        if (tone === "technical") toneInstruction = "técnico, focando em especificações e metodologias";
        if (tone === "friendly") toneInstruction = "amigável, próximo e empático";

        const prompt = `
Você é um especialista em vendas e redação de propostas comerciais de alto nível no mercado brasileiro.
Sua tarefa é gerar uma proposta comercial completa, estruturada em Markdown, baseada nas seguintes informações:

**DADOS DO PROJETO:**
- Nome do Cliente: ${clientName}
- Perfil/Público-Alvo: ${targetAudience || "Não especificado"}
- Tipo de Serviço: ${serviceType}
- Escopo Principal: ${scope}
- Diferenciais/Benefícios a destacar: ${keyBenefits || "Focar nos benefícios padrão do serviço"}
- Prazo Estimado: ${timeframe || "A definir"}
- Fases/Etapas: ${projectPhases || "Definir fases padrão para este tipo de projeto"}
- Tom da comunicação: ${toneInstruction}

**DIRETRIZES DA PROPOSTA:**
1. Use títulos claros (H2 ou H3).
2. Seja persuasivo e foque na SOLUÇÃO para o público-alvo mencionado.
3. Se benefícios foram fornecidos, dê ênfase a eles na seção de diferenciais.

**ESTRUTURA OBRIGATÓRIA:**
1. **Apresentação**: Uma saudação inicial elegante e personalizada para o cliente.
2. **Diagnóstico e Objetivos**: Demonstre entendimento sobre o negócio do cliente e o que ele busca.
3. **Nossa Solução**: Detalhamento técnico e estratégico do que será entregue.
4. **Cronograma e Fases**: Liste as etapas do projeto (use as fases fornecidas se disponíveis).
5. **Investimento Sugerido**: Sugira um valor realista em Reais (R$) compatível com o mercado premium brasileiro.
6. **Por que nos escolher**: Destaque os diferenciais e a segurança da parceria.

Output: Apenas o texto da proposta em Markdown.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 4. Save to Database
        const { data: proposal, error: dbError } = await supabase
            .from('proposals')
            .insert({
                user_id: user.id,
                client_name: clientName,
                service_type: serviceType,
                content: responseText,
                status: 'draft'
            })
            .select()
            .single();

        if (dbError) {
            console.error("DB Error:", dbError);
            return NextResponse.json({ error: "Failed to save proposal" }, { status: 500 });
        }

        return NextResponse.json({ proposal });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
