import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewType = 'dashboard' | 'factoring' | 'marketplace' | 'portfolio';

interface OnboardingTourProps {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    theme?: 'dark' | 'light';
}

interface TourStep {
    title: string;
    description: string;
    targetView: ViewType;
    targetId?: string; // ID of the DOM element to point to
}

const TOUR_STEPS: TourStep[] = [
    {
        title: "Welcome to PropShield",
        description: "Your gateway to privacy-preserved Real World Asset lending. Leverage off-chain data without revealing sensitive details.",
        targetView: 'dashboard',
        targetId: 'nav-dashboard' // Point to Dashboard Nav
    },
    {
        title: "Verify Your Assets",
        description: "Upload your Rent Roll CSV here. The iExec TEE will validate your income and solvency securely off-chain.",
        targetView: 'factoring',
        targetId: 'nav-factoring'
    },
    {
        title: "Your On-Chain Identity",
        description: "Once verified, your Solvency Score and Soulbound Token (SBT) will appear here as proof for lenders.",
        targetView: 'portfolio',
        targetId: 'nav-portfolio'
    },
    {
        title: "Access Liquidity",
        description: "Use your private credit score to access undercollateralized loans from the marketplace.",
        targetView: 'marketplace',
        targetId: 'nav-marketplace'
    }
];

export function OnboardingTour({ currentView, setCurrentView, theme = 'dark' }: OnboardingTourProps) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        setHasMounted(true);
        const hasCompletedTour = localStorage.getItem('propShield_onboarding_completed');
        // const hasCompletedTour = false; // DEBUG: Always show
        if (!hasCompletedTour) {
            setTimeout(() => setIsOpen(true), 1000);
        }
    }, []);

    // Calculate Position Logic
    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const currentStep = TOUR_STEPS[stepIndex];

            // If no target ID, default to center
            if (!currentStep.targetId) {
                setCardStyle({
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100
                });
                setArrowStyle({ display: 'none' });
                return;
            }

            const element = document.getElementById(currentStep.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();

                // Position to the RIGHT of the sidebar items by default
                // Sidebar width is typically ~256px (w-64)
                const left = rect.right + 20;
                const top = rect.top + (rect.height / 2) - 100; // Center vertically relative to item, offset for card height

                setCardStyle({
                    position: 'fixed',
                    left: `${left}px`,
                    top: `${Math.max(20, top)}px`, // Prevent going off top
                    zIndex: 100,
                    width: '400px'
                });

                // Arrow visuals (pointing left)
                setArrowStyle({
                    position: 'absolute',
                    top: '100px', // Roughly middle of where we offset the card
                    left: '-12px',
                    width: '0',
                    height: '0',
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    borderRight: `12px solid ${theme === 'dark' ? '#1e293b' : 'white'}`, // Slate-800 or White
                    display: 'block'
                });
            }
        };

        // Run immediately and on resize
        updatePosition();
        window.addEventListener('resize', updatePosition);

        // Slight delay to ensure DOM is ready after view switch
        const timer = setTimeout(updatePosition, 100);

        return () => {
            window.removeEventListener('resize', updatePosition);
            clearTimeout(timer);
        };

    }, [stepIndex, isOpen, currentView, theme]);


    const handleNext = () => {
        if (stepIndex < TOUR_STEPS.length - 1) {
            const nextStep = stepIndex + 1;
            setStepIndex(nextStep);

            // Navigation
            if (TOUR_STEPS[nextStep].targetView !== currentView) {
                setCurrentView(TOUR_STEPS[nextStep].targetView);
            }
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        setIsOpen(false);
        localStorage.setItem('propShield_onboarding_completed', 'true');
        setTimeout(() => setCurrentView('dashboard'), 500);
    };

    if (!hasMounted || !isOpen) return null;

    const currentStep = TOUR_STEPS[stepIndex];
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === TOUR_STEPS.length - 1;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark Overlay with "Spotlight" feel (optional, kept simple for now) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[90] pointer-events-none"
                    />

                    {/* Card container */}
                    <div style={cardStyle}>
                        <motion.div
                            key={stepIndex}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`p-6 rounded-2xl border shadow-2xl relative
                                ${theme === 'dark'
                                    ? 'bg-slate-800 border-white/10 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'}
                            `}
                        >
                            {/* Arrow Pointer */}
                            <div style={arrowStyle} className="drop-shadow-sm" />

                            {/* Content */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{currentStep.title}</h3>
                                    <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                                        Step {stepIndex + 1}/{TOUR_STEPS.length}
                                    </span>
                                </div>
                                <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {currentStep.description}
                                </p>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleFinish}
                                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-400"
                                    >
                                        Skip
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20"
                                    >
                                        {isLastStep ? "Finish" : "Next →"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
