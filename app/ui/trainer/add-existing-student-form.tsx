'use client';

import { useState, useEffect } from 'react';
import { searchStudents, addStudentToTrainer } from '@/lib/actions';
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export default function AddExistingStudentForm() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Array<{ id: string; name: string | null; email: string; isLinked: boolean; hasTrainers: boolean }>>([]);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string | null; email: string; isLinked: boolean; hasTrainers: boolean } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setSearching(true);
                try {
                    const data = await searchStudents(query);
                    setResults(data);
                    setError(null);
                } catch (err) {
                    setError('Erro ao buscar alunos.');
                    setResults([]);
                } finally {
                    setSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (student: typeof results[0]) => {
        setSelectedStudent(student);
        setResults([]); // Clear results after selection
        setQuery(''); // Clear query
    };

    const handleAdd = async () => {
        if (!selectedStudent) return;
        setLoading(true);
        try {
            await addStudentToTrainer(selectedStudent.id);
            // Optionally redirect or show success message
            // Since server action redirects, we might not need to do anything here
        } catch (err) {
            setError('Erro ao adicionar aluno.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md space-y-4">
            <div className="rounded-md bg-zinc-900 p-4 md:p-6 border border-zinc-800">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="search-student" className="mb-2 block text-sm font-medium text-white">
                            Nome ou Email do Aluno
                        </label>
                        <div className="relative">
                            <input
                                id="search-student"
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedStudent(null); // Deselect if typing new search
                                }}
                                placeholder="Digite para buscar..."
                                className="peer block w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-10 text-sm outline-2 placeholder:text-zinc-500 text-white focus:border-primary focus:ring-primary"
                                autoComplete="off"
                            />
                            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                            {searching && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent"></div>
                                </div>
                            )}
                        </div>

                        {/* Results List */}
                        {results.length > 0 && !selectedStudent && (
                            <div className="mt-2 rounded-md border border-zinc-700 bg-zinc-800 shadow-lg overflow-hidden">
                                {results.map((student) => (
                                    <button
                                        key={student.id}
                                        onClick={() => handleSelect(student)}
                                        className="w-full text-left px-4 py-3 hover:bg-zinc-700 transition-colors border-b border-zinc-700 last:border-none"
                                    >
                                        <p className="text-sm font-medium text-white">{student.name || 'Sem nome'}</p>
                                        <p className="text-xs text-zinc-400">{student.email}</p>
                                        {student.isLinked && (
                                            <p className="text-xs text-green-500">Já vinculado</p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {query.length >= 2 && !searching && results.length === 0 && !selectedStudent && !error && (
                            <p className="mt-2 text-sm text-zinc-500">Nenhum aluno encontrado.</p>
                        )}
                    </div>
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
                )}

                {selectedStudent && (
                    <div className="mt-6 border-t border-zinc-800 pt-4 animate-in fade-in slide-in-from-top-2">
                        <div className="mb-4">
                            <p className="text-sm text-zinc-400">Aluno selecionado:</p>
                            <p className="text-lg font-medium text-white">{selectedStudent.name || 'Sem nome'}</p>
                            <p className="text-sm text-zinc-400">{selectedStudent.email}</p>
                            {selectedStudent.isLinked ? (
                                <p className="mt-2 text-sm text-green-500 font-medium">
                                    Este aluno já está na sua lista.
                                </p>
                            ) : selectedStudent.hasTrainers ? (
                                <p className="mt-2 text-xs text-amber-500">
                                    Este aluno já possui um treinador vinculado.
                                </p>
                            ) : null}
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={loading || selectedStudent.isLinked}
                            className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <UserPlusIcon className="mr-2 h-5 w-5" />
                            {loading ? 'Adicionando...' : (selectedStudent.isLinked ? 'Já Adicionado' : 'Adicionar aos Meus Alunos')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
