import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    id: string;
    file: string;
    size: string;
    status: 'Queued' | 'Encrypting' | 'Computing (TEE)' | 'Verified' | 'Failed';
    progress: number;
    result?: string;
}

export function BulkUploadView({ theme }: { theme: 'dark' | 'light' }) {
    const isDark = theme === 'dark';
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Simulation Engine
    useEffect(() => {
        const interval = setInterval(() => {
            setTasks(currentTasks => {
                return currentTasks.map(task => {
                    if (task.status === 'Verified') return task;

                    // Simulate state progression
                    let newProgress = task.progress + Math.random() * 15;
                    let newStatus: Task['status'] = task.status;

                    if (task.status === 'Queued' && newProgress > 10) {
                        newStatus = 'Encrypting';
                        newProgress = 15;
                    }
                    else if (task.status === 'Encrypting' && newProgress > 40) {
                        newStatus = 'Computing (TEE)';
                        newProgress = 45;
                    }
                    else if (task.status === 'Computing (TEE)' && newProgress > 90) {
                        newStatus = 'Verified';
                        newProgress = 100;
                    }

                    // Cap progress
                    if (newProgress > 100) newProgress = 100;

                    return { ...task, status: newStatus, progress: newProgress };
                });
            });
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const newFiles = Array.from(e.dataTransfer.files).map((file, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            status: 'Queued' as const,
            progress: 0
        }));

        setTasks(prev => [...prev, ...newFiles]);
    };

    const addMockFiles = () => {
        const mocks = [
            { id: Math.random().toString(36), file: 'rent_roll_nyc_portfolio_A.csv', size: '2.4 MB', status: 'Queued' as const, progress: 0 },
            { id: Math.random().toString(36), file: 'rent_roll_miami_condos.csv', size: '1.1 MB', status: 'Queued' as const, progress: 0 },
            { id: Math.random().toString(36), file: 'commercial_leases_q1.pdf', size: '4.8 MB', status: 'Queued' as const, progress: 0 },
        ];
        setTasks(prev => [...prev, ...mocks]);
    };

    return (
        <div className="space-y-6">
            <header>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bulk Import</h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Upload multiple property files for parallel TEE verification (iExec Bag of Tasks).
                </p>
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
                onClick={addMockFiles}
            >
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                    📂
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Drag & Drop Files
                </h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    CSV, XLS, or PDF. Max 50MB per file.
                </p>
                <button className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                    ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                `}>
                    Browse Files
                </button>
            </div>

            {/* Task Queue */}
            {tasks.length > 0 && (
                <div className="space-y-4">
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Processing Queue ({tasks.filter(t => t.status === 'Verified').length}/{tasks.length})
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
                                        : (isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500')}
                                 `}>
                                    {task.status === 'Verified' ? '✓' : '📄'}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{task.file}</span>
                                        <span className={`text-xs font-mono ${getStatusColor(task.status, isDark)}`}>{task.status}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full bg-gray-700/30 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${task.status === 'Verified' ? 'bg-green-500' : 'bg-blue-500'}`}
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
        case 'Computing (TEE)': return isDark ? 'text-purple-400' : 'text-purple-600';
        case 'Encrypting': return isDark ? 'text-blue-400' : 'text-blue-600';
        default: return 'text-gray-500';
    }
}
