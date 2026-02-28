import React from 'react';

export default function JsonLd() {
    const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'PropostaAI',
        'operatingSystem': 'Web',
        'applicationCategory': 'BusinessApplication',
        'offers': {
            '@type': 'Offer',
            'price': '97.00',
            'priceCurrency': 'BRL',
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'ratingCount': '156',
        },
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': 'Como a IA do PropostaAI cria as propostas?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Nossa IA analisa o contexto do seu projeto, o perfil do seu cliente e aplica modelos avançados de copywriting e persuasão comercial para gerar um documento personalizado e convincente.',
                },
            },
            {
                '@type': 'Question',
                'name': 'Posso exportar as propostas em PDF?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Sim, todas as propostas geradas podem ser exportadas instantaneamente em PDF com design profissional e clean, prontas para envio.',
                },
            },
            {
                '@type': 'Question',
                'name': 'Os meus dados estão seguros?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Sim. Utilizamos criptografia de ponta a ponta e seus dados nunca são compartilhados ou usados para treinar modelos de IA externos.',
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}
