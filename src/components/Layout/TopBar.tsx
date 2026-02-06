import React from 'react';
// We'll pass the ConnectButton as a child or just keep the header simple for now
// Depending on how layout is structured, we might need to import ConnectButton here or pass it in.
// For now, let's keep it pure UI and accept children (the connect button).

interface TopBarProps {
    title: string;
    children?: React.ReactNode;
    onDisconnect?: () => void;
    onConnect?: () => void;
    isConnected?: boolean;
    theme?: 'dark' | 'light';
    onToggleTheme?: () => void;
}

export function TopBar({ title, children, onDisconnect, onConnect, isConnected, theme, onToggleTheme }: TopBarProps) {
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);

    return (
        <header className="h-20 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
                <p className="text-sm text-gray-500">Real-World Asset Protocol • Sepolia Network</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-gray-400 relative">

                    {/* Notifications Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
                            className={`hover:text-white transition-colors relative p-2 rounded-lg ${showNotifications ? 'bg-white/10 text-white' : ''}`}
                        >
                            🔔
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                                <div className="p-4 border-b border-white/5 bg-slate-800/50 flex justify-between items-center">
                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">2 New</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="p-4 hover:bg-white/5 border-b border-white/5 transition-colors cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="mt-1 text-lg">🚀</div>
                                            <div>
                                                <p className="text-sm text-white font-medium">Protocol Update</p>
                                                <p className="text-xs text-gray-400 mt-1">Version 2.0 is live! Check out the new Lender Marketplace.</p>
                                                <p className="text-[10px] text-gray-500 mt-2">1 hour ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="mt-1 text-lg">⚠️</div>
                                            <div>
                                                <p className="text-sm text-white font-medium">High Gas Fees</p>
                                                <p className="text-xs text-gray-400 mt-1">Sepolia network is congested. Transactions may be delayed.</p>
                                                <p className="text-[10px] text-gray-500 mt-2">3 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 text-center border-t border-white/5 bg-slate-800/30">
                                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Mark all as read</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                            className={`hover:text-white transition-colors p-2 rounded-lg ${showSettings ? 'bg-white/10 text-white' : ''}`}
                        >
                            ⚙️
                        </button>

                        {showSettings && (
                            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                                <div className="p-4 border-b border-white/5 bg-slate-800/50">
                                    <h3 className="font-bold text-white text-sm">Settings</h3>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => { if (onToggleTheme) onToggleTheme(); }}
                                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-left transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
                                            <span className="text-sm text-gray-300">Dark Mode</span>
                                        </div>
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div>
                                        </div>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left transition-colors text-gray-300">
                                        <span>🌐</span>
                                        <span className="text-sm">Language: English</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left transition-colors text-gray-300">
                                        <span>🔒</span>
                                        <span className="text-sm">Privacy Policy</span>
                                    </button>
                                    <div className="h-px bg-white/5 my-1"></div>
                                    <div className="h-px bg-white/5 my-1"></div>
                                    <button
                                        onClick={() => {
                                            if (isConnected) {
                                                if (onDisconnect) onDisconnect();
                                            } else {
                                                if (onConnect) onConnect();
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${isConnected ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-blue-500/10 text-blue-400'}`}
                                    >
                                        <span>{isConnected ? '🚪' : '🔗'}</span>
                                        <span className="text-sm">{isConnected ? 'Disconnect' : 'Connect Wallet'}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <div className="h-8 w-[1px] bg-white/10"></div>
                {children}
            </div>
        </header>
    );
}
