import React from 'react';

interface DashboardViewProps {
    profile?: any;
    onNavigate?: (view: 'factoring' | 'marketplace' | 'portfolio') => void;
    theme?: 'dark' | 'light';
}

// Internal Component: Modern Semi-Circle Gauge
const SolvencyGauge = ({ score, theme }: { score: number, theme: 'dark' | 'light' }) => {
    const radius = 85;
    const circumference = radius * Math.PI;
    const progress = Math.min(100, Math.max(0, score));
    const offset = circumference - (progress / 100) * circumference;
    // Color logic
    const strokeColor = score >= 80 ? '#10b981' : score >= 50 ? '#eab308' : '#ef4444'; // Emerald, Yellow, Red

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            {/* SVG Gauge */}
            <div className="relative w-48 h-24 overflow-hidden mb-2">
                <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                    {/* Background Arc */}
                    <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" strokeWidth="12" stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} strokeLinecap="round" />
                    {/* Progress Arc */}
                    <path
                        d="M 10 100 A 90 90 0 0 1 190 100"
                        fill="none"
                        strokeWidth="12"
                        stroke={strokeColor}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />
                </svg>
                {/* Needle / Value */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <div className={`text-4xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{score}</div>
                    <div className={`text-[10px] uppercase font-bold tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Score</div>
                </div>
            </div>
        </div>
    );
};

export function DashboardView({ profile, onNavigate, theme = 'dark' }: DashboardViewProps) {
    const isDark = theme === 'dark';
    const [timeRange, setTimeRange] = React.useState<'1M' | '3M' | '6M' | 'YTD'>('6M');

    // Chart Data Config
    const chartData = React.useMemo(() => {
        switch (timeRange) {
            case '1M': return {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                displayPoints: [
                    { x: 0, y: 60, v: '$3.5M' }, { x: 33, y: 40, v: '$3.8M' }, { x: 66, y: 45, v: '$3.7M' }, { x: 100, y: 20, v: '$4.2M' }
                ],
                pathD: "M0,100 L0,60 C15,60 15,40 33,40 C50,40 50,45 66,45 C82,45 82,20 100,20 L100,100 Z",
                lineD: "M0,60 C15,60 15,40 33,40 C50,40 50,45 66,45 C82,45 82,20 100,20"
            };
            case '3M': return {
                labels: ['Oct', 'Nov', 'Dec'],
                displayPoints: [
                    { x: 0, y: 50, v: '$3.2M' }, { x: 50, y: 30, v: '$3.8M' }, { x: 100, y: 10, v: '$4.2M' }
                ],
                pathD: "M0,100 L0,50 C25,50 25,30 50,30 C75,30 75,10 100,10 L100,100 Z",
                lineD: "M0,50 C25,50 25,30 50,30 C75,30 75,10 100,10"
            };
            case 'YTD': return {
                labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
                displayPoints: [
                    { x: 0, y: 80, v: '$1.2M' }, { x: 20, y: 65, v: '$1.8M' }, { x: 40, y: 50, v: '$2.5M' }, { x: 60, y: 35, v: '$3.1M' }, { x: 80, y: 20, v: '$3.8M' }, { x: 100, y: 5, v: '$4.2M' }
                ],
                pathD: "M0,100 L0,80 C10,80 10,65 20,65 C30,65 30,50 40,50 C50,50 50,35 60,35 C70,35 70,20 80,20 C90,20 90,5 100,5 L100,100 Z",
                lineD: "M0,80 C10,80 10,65 20,65 C30,65 30,50 40,50 C50,50 50,35 60,35 C70,35 70,20 80,20 C90,20 90,5 100,5"
            };
            case '6M':
            default: return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                displayPoints: [
                    { x: 20, y: 35, v: '$2.8M' }, { x: 40, y: 55, v: '$2.3M' }, { x: 60, y: 30, v: '$3.4M' }, { x: 80, y: 40, v: '$3.1M' }, { x: 100, y: 5, v: '$4.2M' }
                ],
                pathD: "M0,100 L0,60 C10,60 10,35 20,35 C30,35 30,55 40,55 C50,55 50,30 60,30 C70,30 70,40 80,40 C90,40 90,10 100,5 L100,100 Z",
                lineD: "M0,60 C10,60 10,35 20,35 C30,35 30,55 40,55 C50,55 50,30 60,30 C70,30 70,40 80,40 C90,40 90,10 100,5"
            };
        }
    }, [timeRange]);

    const gaugeScore = profile && profile.creditScore ? Number(profile.creditScore) : 0;

    return (
        <div className="space-y-12 animate-fade-in pb-20 max-w-7xl mx-auto px-6">

            {/* HERO SECTION */}
            {!gaugeScore && (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-900/40 p-1 group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:bg-white/30 transition-colors duration-700"></div>

                    <div className="relative z-10 bg-white/5 backdrop-blur-md rounded-[2.4rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-100 text-xs font-bold uppercase tracking-wide">
                                <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
                                New Protocol Features Live
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                                Privacy-First Credit.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">On-Chain.</span>
                            </h2>
                            <p className="text-xl text-blue-100/80 leading-relaxed max-w-lg">
                                Leverage your off-chain real estate data to access DeFi liquidity without revealing sensitive tenant info.
                            </p>
                            <button
                                onClick={() => onNavigate?.('factoring')}
                                className="group mt-4 inline-flex items-center gap-3 px-8 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg hover:bg-blue-50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/20 transition-all duration-300"
                            >
                                Start Verification
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </button>
                        </div>
                        {/* Hero Illustration */}
                        <div className="relative w-80 h-80 hidden lg:block transform hover:rotate-2 transition-transform duration-700">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 to-indigo-500/30 rounded-full blur-[80px] animate-pulse"></div>
                            <div className="relative z-10 w-full h-full bg-gradient-to-tr from-white/10 to-transparent rounded-[2.5rem] border border-white/20 backdrop-blur-xl rotate-6 flex items-center justify-center shadow-2xl overflow-hidden">
                                <div className="text-9xl filter drop-shadow-2xl">🔒</div>
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] animate-shimmer"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PROTOCOL STATS BAR */}
            <div className="flex items-center gap-2 mb-2 px-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Protocol Network</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase">Simulated</span>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl border
                ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-gray-100 shadow-sm'}
            `}>
                {[
                    { label: "Total Originations", value: "$13,249,052", change: "+4.2%" },
                    { label: "Active Loans", value: "892", change: "+12%" },
                    { label: "Avg. Yield (APY)", value: "11.8%", change: "+2.5%" },
                    { label: "Default Rate", value: "0.2%", change: "-0.1%" },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-2 border-r last:border-0 border-white/5">
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                        <p className={`text-[10px] font-bold ${stat.change.includes('+') ? 'text-emerald-500' : stat.change === 'stable' ? 'text-gray-500' : 'text-red-500'}`}>{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. TVL */}
                <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden
                    ${isDark
                        ? 'bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-blue-500/30 hover:bg-slate-800/40'
                        : 'bg-white border-gray-100 shadow-xl hover:-translate-y-1'}
                `}>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                            +12.5%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Value Locked</p>
                        <h3 className={`text-5xl font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            $4.2M
                        </h3>
                        <div className="w-full h-2 bg-gray-500/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[70%] shadow-[0_0_10px_#3b82f6]"></div>
                        </div>
                        <div className="mt-4 flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>Pool Utilization: 70%</span>
                            <span>Cap: $6M</span>
                        </div>
                    </div>
                </div>

                {/* 2. LOANS */}
                <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden
                    ${isDark
                        ? 'bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-purple-500/30 hover:bg-slate-800/40'
                        : 'bg-white border-gray-100 shadow-xl hover:-translate-y-1'}
                `}>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                            34 Pending
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active Loans</p>
                        <h3 className={`text-5xl font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            142
                        </h3>
                        <div className="flex -space-x-3 pl-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 hover:z-20 ${isDark ? 'border-slate-900 bg-slate-700 text-white' : 'border-white bg-gray-100 text-gray-600'}`}>
                                    {i}
                                </div>
                            ))}
                            <div className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center text-xs font-bold ${isDark ? 'border-slate-900 bg-slate-800 text-gray-400' : 'border-white bg-gray-200 text-gray-500'}`}>+</div>
                        </div>
                        <div className="mt-4 flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>Avg Size: $29.5k</span>
                            <span>Next Expiry: 2d</span>
                        </div>
                    </div>
                </div>

                {/* 3. SOLVENCY STATUS */}
                <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-500 group flex flex-col justify-between
                     ${isDark
                        ? 'bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-emerald-500/30'
                        : 'bg-white border-gray-100 shadow-xl hover:-translate-y-1'}
                `}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

                    {gaugeScore > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Solvency Score</p>
                                <div className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    TEE Verified
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center scale-110 -mt-2">
                                <SolvencyGauge score={gaugeScore} theme={theme} />
                                <div className="text-[10px] font-mono text-gray-500 bg-black/20 px-2 py-1 rounded mt-2 border border-white/5">
                                    Enclave: 0x7f4...9a2
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigate?.('portfolio')}
                                className={`w-full py-3 rounded-xl text-sm font-bold transition-all border mt-4 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-transparent'}`}>
                                View Proof Analysis
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2 ${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                                🔒
                            </div>
                            <div>
                                <h4 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Score Yet</h4>
                                <p className="text-xs text-gray-500 max-w-[200px] mx-auto leading-relaxed">Run the Factoring Engine to generate your privacy-preserved TEE score.</p>
                            </div>
                            <button onClick={() => onNavigate?.('factoring')} className="text-blue-500 text-sm font-bold hover:text-blue-400 transition-colors">Start Verification →</button>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM GRID: CHART + FEED */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CHART */}
                <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group h-full flex flex-col justify-between
                    ${isDark
                        ? 'bg-slate-900/40 backdrop-blur-xl border-white/5'
                        : 'bg-white border-gray-100 shadow-xl'}
                `}>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Protocol TVL History</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">Simulated Data</span>
                                <p className="text-xs text-gray-500 font-medium">{timeRange} Trend</p>
                            </div>
                        </div>
                        <div className={`flex p-1.5 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-100/50 border-gray-200/50'}`}>
                            {['1M', '3M', '6M', 'YTD'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setTimeRange(opt as any)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${timeRange === opt ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-gray-400 hover:bg-white/5'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="h-64 w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                                <mask id="chartMask">
                                    <rect x="0" y="0" width="100" height="100" fill="white">
                                        <animate attributeName="width" from="0" to="100" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                                    </rect>
                                </mask>
                            </defs>
                            {[20, 40, 60, 80].map(y => (
                                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="0.5" strokeDasharray="2 2" />
                            ))}
                            <path d={chartData.pathD} fill="url(#chartGradient)" mask="url(#chartMask)" />
                            <path d={chartData.lineD} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" mask="url(#chartMask)" />
                            {chartData.displayPoints.map((p, i) => (
                                <g key={i} className="group/point cursor-pointer">
                                    <circle cx={p.x} cy={p.y} r="0" className="transition-all duration-300 group-hover/point:r-2" fill={isDark ? "#1e293b" : "white"} stroke="#3b82f6" strokeWidth="1" />
                                    <circle cx={p.x} cy={p.y} r="3" fill="#3b82f6" className="opacity-0 group-hover/point:opacity-100 transition-opacity" />
                                    <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200 pointer-events-none" transform={`translate(${p.x}, ${p.y - 12})`}>
                                        <rect x="-12" y="-8" width="24" height="8" rx="2" fill={isDark ? "#0f172a" : "#1e293b"} />
                                        <text x="0" y="-2.5" textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">{p.v}</text>
                                    </g>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>

                {/* FEED */}
                <div className="space-y-6">
                    {/* Live Verifications */}
                    <div className={`p-8 rounded-[2.5rem] border transition-all duration-300
                        ${isDark
                            ? 'bg-slate-900/40 backdrop-blur-xl border-white/5'
                            : 'bg-white border-gray-100 shadow-xl'}
                    `}>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Verifications</h4>
                            <div className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live Feed
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { hash: "0x7a...9f2", block: "5182931", age: "12s", gas: "0.002", status: "Success" },
                                { hash: "0xb2...1c4", block: "5182928", age: "45s", gas: "0.003", status: "Success" },
                                { hash: "0x9c...3d1", block: "5182915", age: "2m", gas: "0.001", status: "Computing" },
                            ].map((tx, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group cursor-default
                                    ${isDark ? 'bg-white/5 border border-white/5 hover:bg-white/10' : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'}
                                `}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold border-2
                                            ${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}
                                        `}>
                                            TX
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{tx.status === 'Success' ? 'Credit Score Minted' : 'TEE Verification'}</p>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-500 font-mono">#{tx.block}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <span>{tx.age} ago</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span className="font-mono">Gas: {tx.gas} ETH</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide mb-1
                                            ${tx.status === 'Success'
                                                ? (isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-100')
                                                : (isDark ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border border-yellow-100')}
                                        `}>{tx.status}</span>
                                        <span className="text-[9px] text-gray-600 font-mono">{tx.hash}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Updates */}
                    <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden
                        ${isDark
                            ? 'bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border-indigo-500/10'
                            : 'bg-white border-white shadow-xl'}
                    `}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <h4 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Market Updates</h4>
                        <div className={`p-4 rounded-2xl border flex gap-4 items-start
                            ${isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'}
                        `}>
                            <span className="text-2xl mt-0.5">⚠️</span>
                            <div>
                                <p className={`text-sm font-bold ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>Network Congestion</p>
                                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-amber-400/80' : 'text-amber-700/80'}`}>Gas fees on Sepolia are currently higher than usual due to high traffic.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
