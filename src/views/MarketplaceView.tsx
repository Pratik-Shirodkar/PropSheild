import React from 'react';


interface MarketplaceViewProps {
    isConnected: boolean;
    theme?: 'dark' | 'light';
}

export function MarketplaceView({ isConnected, theme = 'dark' }: MarketplaceViewProps) {
    const [fundingIndex, setFundingIndex] = React.useState<number | null>(null);

    const handleFund = (index: number) => {
        if (!isConnected) return;
        setFundingIndex(index);

        // Simulate transaction delay
        setTimeout(() => {
            alert("Liquidity Suppled Successfully! (Simulation)");
            setFundingIndex(null);
        }, 2000);
    };

    const assets = [
        {
            name: "The Meridian Heights",
            location: "128 W 57th St, New York, NY",
            sponsor: "Apex Capital Partners",
            roi: "11.2%",
            rating: "AA",
            amount: "$2,450,000",
            filled: 78,
            term: "24 Mos",
            dscr: "1.35x"
        },
        {
            name: "Logistics Hub Alpha",
            location: "88 Industrial Pkwy, Austin, TX",
            sponsor: "Vanguard Realty",
            roi: "8.9%",
            rating: "A",
            amount: "$1,875,000",
            filled: 42,
            term: "36 Mos",
            dscr: "1.25x"
        },
        {
            name: "Sunset Multi-Family",
            location: "420 Sunset Blvd, Los Angeles, CA",
            sponsor: "West Coast Holdings",
            roi: "13.5%",
            rating: "BBB+",
            amount: "$920,000",
            filled: 92,
            term: "12 Mos",
            dscr: "1.15x"
        },
    ];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto px-6 mb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className={`text-5xl font-black mb-4 tracking-tight ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500' : 'text-gray-900'}`}>
                        Loan Marketplace
                    </h2>
                    <p className={`text-lg max-w-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Provide liquidity to verified real-world asset portfolios. All borrowers have on-chain TEE-proven solvency.
                    </p>
                </div>
                <div className="flex gap-3 items-center bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                    <span className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                        Mock Data
                    </span>
                    <button className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>
                        Filter
                    </button>
                    <button className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white/10 text-white shadow-lg' : 'bg-gray-200 text-gray-900'}`}>
                        Sort by Yield
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {assets.map((asset, i) => (
                    <div key={i} className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 group
                        ${theme === 'dark'
                            ? 'bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/20'
                            : 'bg-white border-gray-100 shadow-xl hover:shadow-2xl hover:translate-y-[-4px]'}
                    `}>
                        {/* Hover Gradient */}
                        <div className={`absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                            ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}
                        />

                        {/* Top Badges */}
                        <div className="relative z-10 flex justify-between items-start mb-8">
                            <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border
                                ${asset.rating === 'A+'
                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}
                            `}>
                                {asset.rating} Rating
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border
                                ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}
                            `}>
                                Real Estate
                            </div>
                        </div>

                        {/* Main Info */}
                        <div className="relative z-10 mb-8">
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className={`text-6xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{asset.roi}</span>
                                <span className="text-blue-500 font-bold text-lg">APY</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-1 truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{asset.name}</h3>
                            <p className="text-xs text-gray-500 font-mono mb-4 flex items-center gap-1">
                                📍 {asset.location}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-gray-500">Sponsor:</span>
                                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{asset.sponsor}</span>
                            </div>
                        </div>

                        {/* DATA GRID */}
                        <div className={`grid grid-cols-2 gap-4 mb-8 p-4 rounded-2xl ${theme === 'dark' ? 'bg-black/20 border border-white/5' : 'bg-gray-50'}`}>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Term</p>
                                <p className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{asset.term}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">DSCR</p>
                                <p className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{asset.dscr}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Collateral</p>
                                <p className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>1st Lien</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Payment</p>
                                <p className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Monthly</p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="relative z-10 space-y-3 mb-8 bg-gray-500/5 p-4 rounded-2xl border border-gray-500/10">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-500">Target Raise</span>
                                <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{asset.amount}</span>
                            </div>
                            <div className={`w-full h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`}>
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${asset.filled}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-blue-400">{asset.filled}% Funded</span>
                                <span className="text-gray-500">{100 - asset.filled}% Remaining</span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="relative z-10">
                            <button
                                onClick={() => handleFund(i)}
                                disabled={!isConnected || fundingIndex !== null}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${!isConnected
                                    ? 'bg-gray-500/10 text-gray-500 cursor-not-allowed border border-gray-500/20'
                                    : theme === 'dark'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/20'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200'
                                    }`}
                            >
                                {fundingIndex === i ? (
                                    <>
                                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                        Supplying...
                                    </>
                                ) : !isConnected ? (
                                    "Connect Wallet"
                                ) : (
                                    "Supply Liquidity"
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
