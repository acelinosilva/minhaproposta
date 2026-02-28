'use client';

import { useEffect, useRef } from 'react';

export default function ViewTracker({ proposalId }: { proposalId: string }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;

        hasTracked.current = true;

        fetch(`/api/proposals/${proposalId}/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(err => {
            console.error('Failed to track view:', err);
        });
    }, [proposalId]);

    return null; // This component doesn't render anything
}
