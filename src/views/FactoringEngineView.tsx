import React from 'react';

// This is where we will inject the logic from page.tsx
// For now, it accepts children so the main page controller can pass the logic down
// This keeps state management centralized in page.tsx for now to minimize refactor risk
interface FactoringEngineViewProps {
    children: React.ReactNode;
}

export function FactoringEngineView({ children }: FactoringEngineViewProps) {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {children}
        </div>
    );
}
