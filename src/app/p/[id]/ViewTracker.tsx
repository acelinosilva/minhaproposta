'use client';

import { useEffect, useRef } from 'react';

export default function ViewTracker({ proposalId }: { proposalId: string }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;

        hasTracked.current = true;

        useEffect(() => {
            if (hasTracked.current) return;
            hasTracked.current = true;

            // Initial view track
            fetch(`/api/proposals/${proposalId}/view`, { method: 'POST' });

            // Heartbeat every 30s to track time-on-page
            const interval = setInterval(() => {
                fetch(`/api/proposals/${proposalId}/heartbeat`, { method: 'POST' });
            }, 30000);

            return () => clearInterval(interval);
        }, [proposalId]);

        return null; // This component doesn't render anything
    }
