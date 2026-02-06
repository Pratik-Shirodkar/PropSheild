import React from 'react';


interface PortfolioViewProps {
    hasMintedSBT: boolean;
    sbtImage: string | null;
    profile?: any;
    theme?: 'dark' | 'light';
}

import { useAccount, useBalance } from "wagmi";

export function PortfolioView({ hasMintedSBT, sbtImage, profile, theme = 'dark' }: PortfolioViewProps) {
    const { address } = useAccount();
    const { data: balance } = useBalance({ address: address });

    return (
        <div className="animate-fade-in max-w-7xl mx-auto px-6 mb-20 space-y-12">

            {/* Header */}
            <div>
                <h1 className="text-5xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    My Portfolio
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage your on-chain identity, assets, and liabilities.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Identity / SBT Card */}
                <div className={`relative p-8 rounded-[2.5rem] overflow-hidden border transition-all duration-500 group
                    ${theme === 'dark'
                        ? 'bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-purple-500/30'
                        : 'bg-white border-gray-100 shadow-xl'}
                `}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 flex justify-between items-start mb-8">
                        <div>
                            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Identity & Reputation</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Soulbound Tokens & Credentials</p>
                        </div>
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'}`}>
                            Import Credential
                        </button>
                    </div>

                    {/* DYNAMIC SBT DISPLAY */}
                    {hasMintedSBT || (profile && Number(profile.creditScore) > 0) ? (
                        <div className={`relative p-6 rounded-3xl border overflow-hidden transition-all duration-500 group-hover:transform group-hover:scale-[1.02]
                            ${theme === 'dark'
                                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 shadow-2xl shadow-purple-900/10'
                                : 'bg-white border-purple-100 shadow-xl shadow-purple-100/50'}
                        `}>
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                {/* Image Container */}
                                <div className="w-32 h-32 flex-shrink-0 rounded-2xl bg-black/20 overflow-hidden relative shadow-inner ring-1 ring-white/10">
                                    {sbtImage ? (
                                        <img src={sbtImage} alt="SBT" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
                                            <span className="text-5xl">🏅</span>
                                        </div>
                                    )}
                                    {hasMintedSBT && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Minted</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
                                        <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>TrustScore Details</h4>
                                        {hasMintedSBT && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500 text-white font-black uppercase tracking-wider shadow-lg shadow-green-500/20">
                                                On-Chain
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Solvency Score</div>
                                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                            {profile?.creditScore || '---'}
                                            <span className="text-lg text-gray-600 ml-1">/100</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>ERC-721</span>
                                        <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>Base Sepolia</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`text-center py-12 border-2 border-dashed rounded-3xl ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-200 bg-gray-50'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <p className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No verification badges</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Run the Factoring Engine to generate your score.</p>
                        </div>
                    )}
                </div>

                {/* 2. Wallet Assets */}
                <div className={`relative p-8 rounded-[2.5rem] overflow-hidden border transition-all duration-500
                    ${theme === 'dark'
                        ? 'bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-blue-500/30'
                        : 'bg-white border-gray-100 shadow-xl'}
                `}>
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                    <div className="relative z-10 flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Wallet Assets</h3>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Connected Balances</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* REAL NATIVE BALANCE */}
                        <div className={`flex justify-between items-center p-5 rounded-3xl transition-all border cursor-pointer group
                            ${theme === 'dark'
                                ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}
                        `}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                                    {balance?.symbol?.slice(0, 1) || 'Ξ'}
                                </div>
                                <div>
                                    <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {balance?.symbol || 'Native Token'}
                                    </p>
                                    <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Connected</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-mono text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {balance ? parseFloat(balance.formatted).toFixed(4) : '0.000'}
                                </p>
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    ~${balance ? (parseFloat(balance.formatted) * 2800).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                                </p>
                            </div>
                        </div>

                        {/* Fallback Dummy Asset */}
                        <div className={`flex justify-between items-center p-5 rounded-3xl transition-all border opacity-50
                             ${theme === 'dark' ? 'bg-transparent border-white/5' : 'bg-transparent border-gray-100'}
                        `}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-500/20 flex items-center justify-center text-gray-500 font-bold">
                                    $
                                </div>
                                <div>
                                    <p className={`font-bold text-lg ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>USDC</p>
                                    <p className="text-xs text-gray-600">Stablecoin</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-mono text-xl font-bold ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>0.00</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Liabilities / Active Loans */}
            <div>
                <div className="flex items-center gap-3 mb-6 px-2">
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Active Liabilities</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        Simulated
                    </span>
                </div>

                <div className={`rounded-[2.5rem] overflow-hidden border
                    ${theme === 'dark'
                        ? 'glass-panel bg-slate-900/40 backdrop-blur-xl border-white/5'
                        : 'bg-white border-gray-100 shadow-xl'}
                `}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b text-xs uppercase text-gray-500 tracking-wider ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'}`}>
                                <th className="p-6 font-bold">Lending Pool</th>
                                <th className="p-6 font-bold">Collateral</th>
                                <th className="p-6 font-bold">Debt</th>
                                <th className="p-6 font-bold">Health Factor</th>
                                <th className="p-6 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <tr className={`border-b transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-gray-100 hover:bg-gray-50'}`}>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                                        <div>
                                            <div className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Aave V3</div>
                                            <div className="text-xs text-gray-500">Market: Ethereum</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 font-mono font-medium">$15,000 <span className="text-gray-500 text-xs ml-1">USDC</span></td>
                                <td className="p-6 font-mono font-medium text-red-400">$8,200 <span className="text-gray-500 text-xs ml-1">WETH</span></td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-500 font-black text-lg">1.82</span>
                                        <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[80%] rounded-full"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button className={`text-xs px-5 py-2.5 rounded-xl border font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                        ${theme === 'dark'
                                            ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500'
                                            : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500'}
                                    `}>Repay</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
