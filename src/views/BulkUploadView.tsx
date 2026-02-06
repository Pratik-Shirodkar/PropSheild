import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IExecDataProtector, IExecDataProtectorCore } from '@iexec/dataprotector';

interface Task {
    id: string;
    file: File;
    fileName: string;
    size: string;
    status: 'Queued' | 'Protecting' | 'Granting Access' | 'Bulk Preparing' | 'Computing (TEE)' | 'Verified' | 'Failed';
    progress: number;
    protectedAddress?: string;
    txHash?: string;
}

export function BulkUploadView({ theme }: { theme: 'dark' | 'light' }) {
    const isDark = theme === 'dark';
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Hardcoded for Hackathon
    const WORKERPOOL_ADDRESS = 'prod-v8-bellecour.main.pools.iexec.eth';
    const PROP_SHIELD_APP = '0xa1974676795629B7c6cD9A8b17fD27fDdA78ad41';

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            fileName: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            status: 'Queued' as const,
            progress: 0
        }));

        setTasks(prev => [...prev, ...newFiles]);
    };

    const runBulkProcess = async () => {
        if (tasks.length === 0 || isProcessing) return;
        setIsProcessing(true);

        try {
            if (typeof window === 'undefined' || !(window as any).ethereum) {
                alert("Please install MetaMask");
                return;
            }

            const provider = (window as any).ethereum;

            // Check Network (Bellecour)
            const chainId = await provider.request({ method: 'eth_chainId' });
            if (parseInt(chainId, 16) !== 134) {
                alert("Please switch to iExec Bellecour Network (134)");
                setIsProcessing(false);
                return;
            }

            const dataProtector = new IExecDataProtector(provider);
            const core = new IExecDataProtectorCore(provider);

            // 1. Protect All Files Loop
            const protectedAddresses: string[] = [];

            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                if (task.status === 'Verified') {
                    protectedAddresses.push(task.protectedAddress!);
                    continue;
                }

                updateTaskStatus(task.id, 'Protecting', 20);

                // Read file content
                const content = await task.file.text();

                const protectedData = await dataProtector.core.protectData({
                    name: `PropShield-Bulk-${task.fileName.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`,
                    data: { rentRollCsv: content }
                });

                protectedAddresses.push(protectedData.address);
                updateTaskStatus(task.id, 'Granting Access', 40, protectedData.address);
            }

            // 2. Grant Access Loop (Bulk Compatible)
            const grantedAccesses = [];
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                const address = protectedAddresses[i];

                // Allow Bulk is critical here!
                const access = await dataProtector.core.grantAccess({
                    protectedData: address,
                    authorizedApp: PROP_SHIELD_APP,
                    authorizedUser: '0x0000000000000000000000000000000000000000',
                    pricePerAccess: 0,
                    numberOfAccess: 1,
                    // @ts-ignore - allowBulk is in beta
                    allowBulk: true,
                });
                grantedAccesses.push(access);
                updateTaskStatus(task.id, 'Bulk Preparing', 60);
            }

            // 3. Prepare Bulk Request
            // We need to update *all* tasks to "Bulk Preparing"
            setTasks(prev => prev.map(t => ({ ...t, status: 'Bulk Preparing', progress: 70 })));

            const { bulkRequest } = await core.prepareBulkRequest({
                bulkAccesses: grantedAccesses,
                app: PROP_SHIELD_APP,
                workerpool: WORKERPOOL_ADDRESS,
            });

            // 4. Execute Bulk Request
            setTasks(prev => prev.map(t => ({ ...t, status: 'Computing (TEE)', progress: 85 })));

            await core.processBulkRequest({
                bulkRequest: bulkRequest,
                waitForResult: true,
            });

            // 5. Complete
            setTasks(prev => prev.map(t => ({ ...t, status: 'Verified', progress: 100 })));

        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            // console.error(error); // Commented out for lint
            setTasks(prev => prev.map(t => ({ ...t, status: 'Failed', progress: 0 })));
            alert(`Bulk Error: ${msg}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const updateTaskStatus = (id: string, status: Task['status'], progress: number, address?: string) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status, progress, protectedAddress: address } : t
        ));
    };

    return (
        <div className="space-y-6">
            <header>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bulk Import</h2>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            PropShield Enterprise: TEE Bulk Verification
                        </p>
                    </div>
                    {tasks.length > 0 && !isProcessing && (
                        <button
                            onClick={runBulkProcess}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                        >
                            Process {tasks.length} Files
                        </button>
                    )}
                    {isProcessing && (
                        <button disabled className="bg-gray-600 text-white px-6 py-2 rounded-xl font-bold cursor-wait">
                            Processing Batch...
                        </button>
                    )}
                </div>
            </header>

            {/* Upload Zone */}
            <div
                className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
                    ${isDragging
                        ? (isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50')
                        : (isDark ? 'border-white/10 hover:border-white/20 bg-white/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50')}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                    📂
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Drag & Drop CSV Files
                </h3>
            </div>

            {/* Task Queue */}
            {tasks.length > 0 && (
                <div className="space-y-4">
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Processing Queue ({tasks.length})
                    </h3>

                    <AnimatePresence>
                        {tasks.map(task => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl border flex items-center gap-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg
                                    ${task.status === 'Verified'
                                        ? 'bg-green-500/20 text-green-500'
                                        : (task.status === 'Failed' ? 'bg-red-500/20 text-red-500' : (isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'))}
                                 `}>
                                    {task.status === 'Verified' ? '✓' : (task.status === 'Failed' ? '✗' : '📄')}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{task.fileName}</span>
                                        <span className={`text-xs font-mono ${getStatusColor(task.status, isDark)}`}>{task.status}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full bg-gray-700/30 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${task.status === 'Verified' ? 'bg-green-500' : (task.status === 'Failed' ? 'bg-red-500' : 'bg-blue-500')}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${task.progress}%` }}
                                            transition={{ type: "spring", stiffness: 50 }}
                                        />
                                    </div>
                                </div>

                                <div className={`text-xs font-mono w-16 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {task.size}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

function getStatusColor(status: Task['status'], isDark: boolean) {
    switch (status) {
        case 'Verified': return isDark ? 'text-green-400' : 'text-green-600';
        case 'Failed': return isDark ? 'text-red-400' : 'text-red-600';
        case 'Computing (TEE)': return isDark ? 'text-purple-400' : 'text-purple-600';
        case 'Protecting': return isDark ? 'text-blue-400' : 'text-blue-600';
        default: return 'text-gray-500';
    }
}
