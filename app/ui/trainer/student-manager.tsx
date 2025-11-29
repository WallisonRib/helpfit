'use client';

import { useState } from 'react';
import CreateStudentForm from './create-student-form';
import AddExistingStudentForm from './add-existing-student-form';
import { cn } from '@/lib/utils';

export default function StudentManager() {
    const [activeTab, setActiveTab] = useState<'create' | 'existing'>('create');

    return (
        <div className="w-full max-w-md">
            <div className="flex w-full mb-6 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button
                    onClick={() => setActiveTab('create')}
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === 'create'
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                    )}
                >
                    Novo Aluno
                </button>
                <button
                    onClick={() => setActiveTab('existing')}
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === 'existing'
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                    )}
                >
                    Aluno Existente
                </button>
            </div>

            {activeTab === 'create' ? (
                <CreateStudentForm />
            ) : (
                <AddExistingStudentForm />
            )}
        </div>
    );
}
