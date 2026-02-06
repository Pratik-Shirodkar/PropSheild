import React from 'react';

interface LandingViewProps {
    onLaunch: () => void;
}

export function LandingView({ onLaunch }: LandingViewProps) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0c15] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden relative">

            {/* Background Effects */}
            <style jsx>{`
                @keyframes grid-move {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(50px); }
                }
                @keyframes float-particle {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
                @keyframes beam-flow {
                    0% { transform: translateX(-100%) translateY(-100%); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateX(200%) translateY(200%); opacity: 0; }
                }
                .bg-grid-animate {
                    background-size: 50px 50px;
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
                    animation: grid-move 2s linear infinite;
                }
                .particle {
                    position: absolute;
                    background: linear-gradient(to bottom, #3b82f6, #818cf8);
                    border-radius: 2px;
                    pointer-events: none;
                }
                .neon-beam {
                    position: absolute;
                    width: 3px;
                    height: 350px;
                    background: linear-gradient(to bottom, transparent, #60a5fa, #818cf8, #c084fc, transparent);
                    box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(139, 92, 246, 0.3);
                    filter: blur(0.5px);
                    opacity: 0;
                    pointer-events: none;
                }
            `}</style>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* 3D Perspective Grid with deeper glow */}
                <div className="absolute inset-x-0 -top-[50%] h-[200%] bg-grid-animate [perspective:1000px] [transform:rotateX(60deg)] opacity-40"></div>

                {/* Neon Beams - Rendered client-side */}
                {mounted && [...Array(12)].map((_, i) => (
                    <div
                        key={`beam-${i}`}
                        className="neon-beam"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 40}%`,
                            transform: `rotate(${45 + (Math.random() * 10 - 5)}deg)`,
                            animation: `beam-flow ${4 + Math.random() * 6}s linear infinite`,
                            animationDelay: `${Math.random() * 8}s`
                        }}
                    ></div>
                ))}

                {/* Floating Particles - Client side only */}
                {mounted && [...Array(30)].map((_, i) => (
                    <div
                        key={`p-${i}`}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${100 + Math.random() * 20}%`,
                            width: `${2 + Math.random() * 3}px`,
                            height: `${2 + Math.random() * 3}px`,
                            animation: `float-particle ${8 + Math.random() * 12}s linear infinite`,
                            animationDelay: `${Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="container mx-auto px-6 h-24 flex items-center justify-between relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">PS</div>
                    <span className="text-xl font-bold tracking-tight">PropShield</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#stats" className="hover:text-white transition-colors">Protocol Data</a>
                    <a href="#features" className="hover:text-white transition-colors">Privacy Tech</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                    <a href="https://docs.iex.ec" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">iExec Docs</a>
                </div>
                <button
                    onClick={onLaunch}
                    className="group px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-semibold backdrop-blur-md flex items-center gap-2"
                >
                    Launch App
                    <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </nav>

            <main className="relative z-10">

                {/* Hero Section */}
                <div className="container mx-auto px-6 pt-16 pb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Live on Sepolia & iExec Bellecour
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter animate-fade-in-up delay-100">
                        Liquidate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Real World Solvency</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                        PropShield transforms private real estate data into verifiable on-chain credit. <br />
                        <span className="text-blue-400 font-semibold">Native Account Abstraction</span> & <span className="text-indigo-400 font-semibold">Institutional Bulk Verification</span>.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
                        <button
                            onClick={onLaunch}
                            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all w-full md:w-auto"
                        >
                            Launch Terminal
                        </button>
                    </div>
                </div>



                {/* Feature Grid */}
                <div id="features" className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Zero-Knowledge Architecture</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Built on iExec TEE (Trusted Execution Environments) to ensure your sensitive financial data never leaves the secure enclave unencrypted.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon="🔒"
                            title="Confidential Computing"
                            desc="Intel SGX hardware enclaves ensure that not even the node operator can view the code or data being processed."
                            tech="AES-256 + SGX"
                        />
                        <FeatureCard
                            icon="🌐"
                            title="Account Abstraction"
                            desc="Institutional onboarding made simple. Login with Email or Socials via Reown AppKit integration."
                            tech="Reown + AA"
                        />
                        <FeatureCard
                            icon="📊"
                            title="Bulk Processing"
                            desc="Scale your portfolio. Process hundreds of rent rolls simultaneously with our institutional batch engine."
                            tech="Bag of Tasks"
                        />
                        <FeatureCard
                            icon="⚡"
                            title="DeFi Composability"
                            desc="Turn verifiable cash flow into collateral. Use your Verified SBT to access undercollateralized loans on Aave."
                            tech="ERC-721 SBT"
                        />
                    </div>
                </div>

                {/* Partners Section */}
                <div className="container mx-auto px-6 pb-16 text-center opacity-70 hover:opacity-100 transition-opacity">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Trusted Ecosystem Partners</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale hover:grayscale-0 transition-all duration-500">
                        <PartnerLogo name="iExec" />
                        <PartnerLogo name="Ethereum" />
                        <PartnerLogo name="Polygon" />
                        <PartnerLogo name="Chainlink" />
                        <PartnerLogo name="The Graph" />
                    </div>
                </div>

                {/* How It Works Section */}
                <div id="how-it-works" className="bg-gradient-to-b from-transparent to-blue-900/10 border-t border-white/5 py-20">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-8">How PropShield Works</h2>
                                <div className="space-y-8">
                                    <StepRow
                                        num="01"
                                        title="Upload & Encrypt"
                                        desc="Local client-side encryption of your Rent Roll CSV. Keys are shared securely only with the TEE enclave."
                                    />
                                    <StepRow
                                        num="02"
                                        title="Off-Chain Validation"
                                        desc="iExec workers verify the data against banking APIs within a secure hardware enclave."
                                    />
                                    <StepRow
                                        num="03"
                                        title="On-Chain Settlement"
                                        desc="A zk-proof result (Solvency Score) is posted to Ethereum, minting your Soulbound Token."
                                    />
                                </div>
                                <div className="mt-12">
                                    <button
                                        onClick={onLaunch}
                                        className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all"
                                    >
                                        Start Verification Now →
                                    </button>
                                </div>
                            </div>
                            {/* Visual Graphic Representation */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
                                <div className="relative z-10 p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
                                    <div className="space-y-4 font-mono text-sm text-gray-400">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Encryption Status</span>
                                            <span className="text-green-400">LOCKED</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Enclave Hash</span>
                                            <span className="text-white">0x7f4...9a2</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Proof Verification</span>
                                            <span className="text-blue-400">PENDING...</span>
                                        </div>
                                        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center mt-6">
                                            <p className="text-xs text-blue-300 uppercase font-bold mb-1">Generated Output</p>
                                            <p className="text-2xl font-black text-white">Score: 92/100</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROTOCOL STATS TICKER */}
                <div id="stats" className="border-y border-white/5 bg-black/30 backdrop-blur-xl">
                    <div className="container mx-auto px-6 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <StatBox label="Total Value Secured" value="$14.2M" sub="Verified RWA Assets" color="text-blue-400" />
                            <StatBox label="Active Enclaves" value="28" sub="iExec Worker Pools" color="text-indigo-400" />
                            <StatBox label="Privacy Computations" value="1,892" sub="Last 24 Hours" color="text-purple-400" />
                            <StatBox label="Protocol APY" value="12.4%" sub="Avg. Lender Yield" color="text-green-400" />
                        </div>
                        <div className="text-center mt-8">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold text-gray-500 border border-white/5">
                                ⚠ Demo Data: Simulated for Hackathon
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/5 bg-black/20 backdrop-blur-xl">
                    <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-xs text-gray-500">PS</div>
                            <p>© 2024 PropShield Protocol.</p>
                        </div>
                        <div className="flex items-center gap-8">
                            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Security Audit</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

function StatBox({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
    return (
        <div className="text-center group cursor-default">
            <h3 className={`text-4xl md:text-5xl font-black tracking-tight mb-2 ${color} drop-shadow-lg`}>{value}</h3>
            <p className="text-white font-bold text-sm uppercase tracking-wider mb-1">{label}</p>
            <p className="text-xs text-gray-500">{sub}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc, tech }: { icon: string, title: string, desc: string, tech: string }) {
    return (
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono border border-blue-500/30 text-blue-400 px-2 py-1 rounded bg-blue-500/10">{tech}</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
                {desc}
            </p>
        </div>
    );
}

function StepRow({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="text-2xl font-black text-gray-700 group-hover:text-blue-500 transition-colors">{num}</div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function PartnerLogo({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs opacity-50">
                {name[0]}
            </div>
            <span>{name}</span>
        </div>
    );
}
