'use client';

import { useState } from 'react';

interface FollowUpButtonProps {
    clientName: string;
    serviceType: string;
}

export default function FollowUpButton({ clientName, serviceType }: FollowUpButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleFollowUp = () => {
        const message = `Olá ${clientName}, passei para saber se conseguiu dar uma olhada na proposta que te enviei para ${serviceType}? Qualquer dúvida estou à disposição!`;
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleFollowUp}
            className="btn-outline btn-sm"
            style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderColor: copied ? '#22c55e' : 'var(--c-primary)',
                color: copied ? '#22c55e' : 'var(--c-primary)',
                marginLeft: '8px'
            }}
        >
            {copied ? '✅ Copiado!' : '📣 Follow-up'}
        </button>
    );
}
