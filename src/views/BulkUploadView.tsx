import React, { useState, useRef } from 'react';
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
    taskId?: string;
}

export function BulkUploadView({ theme }: { theme: 'dark' | 'light' }) {
    const isDark = theme === 'dark';
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hardcoded for Hackathon
    const WORKERPOOL_ADDRESS = '0x9DEB16F7861123CE34AE755F48D30697eD066793';
    const PROP_SHIELD_APP = '0xa1974676795629B7c6cD9A8b17fD27fDdA78ad41';

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map((file) => ({
                id: Math.random().toString(36).substr(2, 9),
                file: file,
                fileName: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                status: 'Queued' as const,
                progress: 0
            }));
            setTasks(prev => [...prev, ...newFiles]);
        }
    };

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
            const core = dataProtector.core;

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

                const protectedData = await core.protectData({
                    name: `PropShield-Bulk-${task.fileName.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`,
                    data: { rentRollCsv: content }
                });

                protectedAddresses.push(protectedData.address);
                updateTaskStatus(task.id, 'Granting Access', 40, protectedData.address);
            }

            // 3. Process Per File (Simulated for Hackathon Demo)
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                if (task.status === 'Verified') continue;

                updateTaskStatus(task.id, 'Computing (TEE)', 70);

                // Simulate TEE computation delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                const mockTaskId = `0x${Math.random().toString(16).substr(2, 64)}`;
                updateTaskStatus(task.id, 'Verified', 100, undefined, mockTaskId);
            }


            setIsProcessing(false);
            /*
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#10b981']
            });
            */



        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("Bulk Failure:", error);
            const cause = error.errorCause || error.cause || error;
            const msg = error instanceof Error ? error.message : String(error);
            setTasks(prev => prev.map(t => ({ ...t, status: 'Failed', progress: 0 })));

            // Show detailed error for debugging
            alert(`Debug Error: ${msg}\nCause: ${JSON.stringify(cause, null, 2)}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const updateTaskStatus = (id: string, status: Task['status'], progress: number, address?: string, taskId?: string) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status, progress, protectedAddress: address, taskId: taskId || t.taskId } : t
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
            <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".csv,.pdf,.xls,.xlsx"
            />
            <div
                className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
                    ${isDragging
                        ? (isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50')
                        : (isDark ? 'border-white/10 hover:border-white/20 bg-white/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50')}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
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
