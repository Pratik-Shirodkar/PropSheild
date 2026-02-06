import React from 'react';

type View = 'dashboard' | 'factoring' | 'marketplace' | 'portfolio' | 'bulk-upload';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    theme?: 'dark' | 'light';
    address?: string; // Add optional address prop
}

export function Sidebar({ currentView, setView, theme = 'dark', address }: SidebarProps) {
    const menuItems: { id: View; label: string; icon: string }[] = [
        { id: 'dashboard', label: 'Overview', icon: '📊' },
        { id: 'factoring', label: 'Factoring Engine', icon: '🏭' },
        { id: 'marketplace', label: 'Loan Marketplace', icon: '💸' },
        { id: 'portfolio', label: 'My Portfolio', icon: '💼' },
        { id: 'bulk-upload', label: 'Bulk Import', icon: '📂' },
    ];

    // Format address for display
    const displayName = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : 'Connect Wallet';

    const userInitials = address
        ? '0x'
        : '--';

    return (
        <div className={`w-64 h-screen fixed left-0 top-0 border-r flex flex-col z-50 transition-colors duration-300
            ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200 shadow-xl'}
        `}>
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                    PropShield
                </h1>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Enterprise Suite</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        id={`nav-${item.id}`} // Added for Onboarding Tour targeting
                        onClick={() => setView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${currentView === item.id
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className={`rounded-xl p-4 border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-black shadow-lg shadow-emerald-500/20">
                            {userInitials}
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {displayName}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${address ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide">
                                    {address ? 'Verified User' : 'Guest'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
